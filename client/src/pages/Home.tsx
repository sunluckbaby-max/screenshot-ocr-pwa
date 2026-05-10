/**
 * Design: Dark Tech Craft
 * - Background: Deep space black (#0F0F13)
 * - Primary: Indigo-violet gradient (#6366F1 → #8B5CF6)
 * - Cards: Glassmorphism (backdrop-blur, semi-transparent)
 * - Typography: Space Grotesk (headings) + Noto Sans SC (body)
 * - Interactions: Touch-first, pulse animations, slide-in results
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { Camera, Upload, FileImage, Copy, Trash2, CheckCheck, ScanText, X } from "lucide-react";
import { toast } from "sonner";

type Tab = "upload" | "camera";
type Status = "idle" | "processing" | "done" | "error";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [resultText, setResultText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraStream]);

  // Start camera when switching to camera tab
  useEffect(() => {
    if (activeTab === "camera" && !capturedPhoto) {
      startCamera();
    } else if (activeTab !== "camera") {
      stopCamera();
    }
  }, [activeTab]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      toast.error("无法访问摄像头，请检查权限设置");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedPhoto(dataUrl);
    setPreviewUrl(dataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setPreviewUrl(null);
    setResultText("");
    setStatus("idle");
    startCamera();
  };

  const runOCR = useCallback(async (imageSource: string | File) => {
    setStatus("processing");
    setProgress(0);
    setResultText("");

    try {
      const worker = await createWorker(["chi_sim", "eng"], 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(imageSource);
      await worker.terminate();

      const text = data.text.trim();
      if (text) {
        setResultText(text);
        setStatus("done");
        toast.success("文字提取成功！");
      } else {
        setStatus("error");
        toast.error("未识别到文字，请尝试更清晰的图片");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("OCR 识别失败，请重试");
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResultText("");
    setStatus("idle");
    runOCR(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resultText);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setResultText("");
    setStatus("idle");
    setPreviewUrl(null);
    setProgress(0);
    setCapturedPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (activeTab === "camera") startCamera();
  };

  const handleCameraOCR = () => {
    if (capturedPhoto) {
      runOCR(capturedPhoto);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F13] text-slate-100 flex flex-col" style={{ fontFamily: "'Space Grotesk', 'Noto Sans SC', sans-serif" }}>
      {/* Header */}
      <header className="relative z-10 px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ScanText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            截图文字提取
          </h1>
        </div>
        <p className="text-slate-500 text-sm pl-12">上传截图或拍照，智能识别文字内容</p>
      </header>

      {/* Tab Switcher */}
      <div className="px-5 mb-5">
        <div className="relative flex bg-white/5 rounded-2xl p-1 backdrop-blur-sm border border-white/10">
          <div
            className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25 transition-all duration-300 ease-out"
            style={{ width: "calc(50% - 4px)", left: activeTab === "upload" ? "4px" : "calc(50%)" }}
          />
          <button
            className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300 ${activeTab === "upload" ? "text-white" : "text-slate-400"}`}
            onClick={() => { setActiveTab("upload"); handleClear(); }}
          >
            <Upload className="w-4 h-4" />
            上传图片
          </button>
          <button
            className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300 ${activeTab === "camera" ? "text-white" : "text-slate-400"}`}
            onClick={() => { setActiveTab("camera"); handleClear(); }}
          >
            <Camera className="w-4 h-4" />
            拍照识别
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 pb-8 flex flex-col gap-4">
        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="flex flex-col gap-4">
            {!previewUrl ? (
              <div
                className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
                  dragOver
                    ? "border-indigo-400 bg-indigo-500/10 scale-[0.99]"
                    : "border-white/15 bg-white/3 hover:border-indigo-500/50 hover:bg-indigo-500/5"
                }`}
                style={{ minHeight: "220px" }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {/* Glow effect */}
                {dragOver && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-3xl" />
                )}
                <div className="relative flex flex-col items-center justify-center h-full py-14 gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragOver ? "bg-indigo-500/30 scale-110" : "bg-white/8"}`}>
                    <FileImage className={`w-8 h-8 transition-colors duration-300 ${dragOver ? "text-indigo-400" : "text-slate-400"}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-200 font-semibold text-base mb-1">
                      {dragOver ? "松开以上传" : "点击或拖拽上传"}
                    </p>
                    <p className="text-slate-500 text-sm">支持 JPG、PNG、WebP 等格式</p>
                  </div>
                  <div className="flex gap-2">
                    {["JPG", "PNG", "WebP", "HEIC"].map((fmt) => (
                      <span key={fmt} className="px-2.5 py-1 text-xs font-medium bg-white/8 text-slate-400 rounded-lg border border-white/10">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                />
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/3">
                <img src={previewUrl} alt="预览" className="w-full max-h-64 object-contain bg-black/20" />
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Camera Tab */}
        {activeTab === "camera" && (
          <div className="flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black" style={{ minHeight: "260px" }}>
              {!capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ minHeight: "260px" }}
                  />
                  {/* Viewfinder corners */}
                  <div className="absolute inset-4 pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-400 rounded-br-lg" />
                  </div>
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl shadow-white/20 active:scale-95 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
                  </button>
                </>
              ) : (
                <>
                  <img src={capturedPhoto} alt="拍摄预览" className="w-full object-contain bg-black/20" style={{ minHeight: "260px" }} />
                  <button
                    onClick={retakePhoto}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />

            {capturedPhoto && status === "idle" && (
              <button
                onClick={handleCameraOCR}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <ScanText className="w-5 h-5" />
                开始识别文字
              </button>
            )}
          </div>
        )}

        {/* Processing State */}
        {status === "processing" && (
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30" />
                <div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin"
                />
              </div>
              <div>
                <p className="text-slate-200 font-semibold text-sm">正在识别文字...</p>
                <p className="text-slate-500 text-xs">AI 引擎处理中，请稍候</p>
              </div>
              <span className="ml-auto text-indigo-400 font-bold text-lg">{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Result */}
        {status === "done" && resultText && (
          <div
            className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <span className="text-slate-200 font-semibold text-sm">识别结果</span>
                <span className="text-slate-500 text-xs">{resultText.length} 字符</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    copied
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/8 text-slate-300 border border-white/10 hover:bg-indigo-500/20 hover:text-indigo-400 hover:border-indigo-500/30"
                  }`}
                >
                  {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "已复制" : "复制"}
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/8 text-slate-300 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  清除
                </button>
              </div>
            </div>
            <div className="px-5 py-4 max-h-72 overflow-y-auto">
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                {resultText}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="rounded-3xl bg-red-500/8 border border-red-500/20 p-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <X className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-red-300 font-semibold text-sm">识别失败</p>
              <p className="text-red-400/70 text-xs mt-0.5">请尝试更清晰的图片，或确保图片包含可识别的文字</p>
            </div>
            <button onClick={handleClear} className="ml-auto text-red-400/60 hover:text-red-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tips */}
        {status === "idle" && !previewUrl && (
          <div className="rounded-2xl bg-white/3 border border-white/8 p-4">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">使用提示</p>
            <div className="flex flex-col gap-2">
              {[
                "支持中英文混合识别",
                "图片越清晰，识别效果越好",
                "可识别截图、文档、书籍等",
              ].map((tip, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 flex-shrink-0" />
                  <p className="text-slate-400 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
