import { useState } from "react";
import { Upload, Loader2, CheckCircle, XCircle, Image as ImageIcon, Sparkles, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8000";



const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [taskId, setTaskId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [prediction, setPrediction] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus("idle");
      setPrediction(null);
      setTaskId("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!data.task_id) {
        throw new Error("Backend did not return task_id");
      }


      setTaskId(data.task_id);
      setStatus("processing");
      pollResult(data.task_id);
    } 
    catch (error) {
      setStatus("error");
      toast({
        title: "Upload Failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const pollResult = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/result/${id}`);
        const data = await response.json();

        if (data.status === "done") {
          clearInterval(interval);
          setStatus("success");
          setPrediction(data.prediction);
          toast({
            title: "Prediction Complete",
            description: "Your image has been analyzed successfully.",
          });
        } else if (data.status === "failed") {
          clearInterval(interval);
          setStatus("error");
          toast({
            title: "Prediction Failed",
            description: "Something went wrong during processing.",
            variant: "destructive",
          });
        }
      } catch (error) {
        clearInterval(interval);
        setStatus("error");
      }
    }, 2000);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setTaskId("");
    setStatus("idle");
    setPrediction(null);
  };

const formatPrediction = (pred: any) => {
  if (typeof pred === "object" && pred !== null) {
    const label = pred.label;
    const confidence = pred.confidence;
    const isReal = label.toLowerCase() === "real";
    const isFake = label.toLowerCase() === "fake";
    return { label, confidence: (confidence * 100).toFixed(2), isReal, isFake };
  }
  return null;
};


  const formattedPrediction = prediction ? formatPrediction(prediction) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Header */}
      <div className="relative border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16 md:py-20 relative">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Shield className="h-12 w-12 text-primary animate-glow-pulse" />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
              </div>
              <Sparkles className="h-8 w-8 text-accent-glow animate-pulse" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              <span className="text-gradient">DeepFake</span>
              <br />
              <span className="text-foreground">Detector</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced <span className="text-primary-glow font-semibold">Vision Transformer</span> model detecting AI-generated and manipulated images with state-of-the-art accuracy
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Badge variant="secondary" className="text-sm px-4 py-2 glass-effect border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Vision Transformer
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2 glass-effect border-accent/20">
                Real-time Analysis
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2 glass-effect">
                99%+ Accuracy
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <Card className="w-full max-w-4xl glass-effect shadow-[0_0_80px_rgba(0,0,0,0.3)] border-2 border-border/50 animate-fade-in-up hover:shadow-[0_0_100px_rgba(0,0,0,0.4)] transition-all duration-500">
          <CardHeader className="text-center border-b border-border/50 glass-effect pb-8">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <ImageIcon className="h-7 w-7 text-primary-glow" />
              </div>
              <span className="text-gradient">Upload & Analyze</span>
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Upload any image to verify its authenticity with AI-powered detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            {!selectedFile ? (
              <div className="relative border-2 border-dashed border-primary/40 rounded-2xl p-20 text-center hover:border-primary hover:bg-primary/5 transition-all duration-500 group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="cursor-pointer relative z-10">
                  <div className="flex justify-center mb-8">
                    <div className="relative p-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-primary/30">
                      <Upload className="h-16 w-16 text-primary-glow" />
                      <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-3 text-foreground group-hover:text-gradient transition-all">Drop your image here</p>
                  <p className="text-base text-muted-foreground mb-2">or click to browse your files</p>
                  <p className="text-sm text-muted-foreground/70 mt-4 font-mono">Supports PNG, JPG, GIF • Max 10MB</p>
                </label>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="relative rounded-2xl overflow-hidden border-2 border-border/50 shadow-[0_0_40px_rgba(0,0,0,0.2)] group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img src={previewUrl} alt="Preview" className="w-full h-96 object-contain bg-card/50 backdrop-blur-sm relative z-10" />
                  {status === "processing" && (
                    <div className="absolute inset-0 glass-effect flex items-center justify-center z-20">
                      <div className="text-center space-y-4">
                        <div className="relative inline-block">
                          <Loader2 className="h-16 w-16 animate-spin text-primary-glow mx-auto" />
                          <div className="absolute inset-0 animate-ping opacity-20">
                            <Loader2 className="h-16 w-16 text-primary-glow" />
                          </div>
                        </div>
                        <p className="text-lg font-semibold text-gradient">Analyzing with Vision Transformer...</p>
                        <p className="text-sm text-muted-foreground">Processing image features...</p>
                      </div>
                    </div>
                  )}
                </div>

                {status === "idle" && (
                  <Button 
                    onClick={handleUpload} 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-primary-glow to-primary hover:shadow-[0_0_40px_rgba(147,51,234,0.4)] transition-all duration-500 relative overflow-hidden group" 
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/0 via-primary-glow/50 to-primary-glow/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Sparkles className="mr-3 h-6 w-6 relative z-10" />
                    <span className="relative z-10">Analyze Image</span>
                  </Button>
                )}

                {status === "uploading" && (
                  <div className="flex items-center justify-center p-8 glass-effect rounded-2xl border border-primary/30 glow-primary">
                    <Loader2 className="h-7 w-7 animate-spin mr-4 text-primary-glow" />
                    <span className="font-semibold text-lg">Uploading image...</span>
                  </div>
                )}

                {status === "success" && formattedPrediction && (
                  <div className={`p-10 rounded-2xl border-2 animate-fade-in-up relative overflow-hidden ${
                    formattedPrediction.isReal 
                      ? 'glass-effect border-accent glow-accent' 
                      : formattedPrediction.isFake 
                      ? 'glass-effect border-destructive glow-destructive' 
                      : 'glass-effect border-primary glow-primary'
                  }`}>
                    <div className="absolute inset-0 opacity-10">
                      <div className={`absolute inset-0 bg-gradient-to-br ${
                        formattedPrediction.isReal 
                          ? 'from-accent/30 to-accent-glow/30' 
                          : 'from-destructive/30 to-destructive-glow/30'
                      }`}></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {formattedPrediction.isReal ? (
                              <>
                                <CheckCircle className="h-12 w-12 text-accent-glow" />
                                <div className="absolute inset-0 animate-ping opacity-20">
                                  <CheckCircle className="h-12 w-12 text-accent" />
                                </div>
                              </>
                            ) : formattedPrediction.isFake ? (
                              <>
                                <AlertTriangle className="h-12 w-12 text-destructive-glow" />
                                <div className="absolute inset-0 animate-ping opacity-20">
                                  <AlertTriangle className="h-12 w-12 text-destructive" />
                                </div>
                              </>
                            ) : (
                              <CheckCircle className="h-12 w-12 text-primary-glow" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold capitalize mb-1">{formattedPrediction.label}</h3>
                            <p className="text-base text-muted-foreground font-semibold">Detection Complete</p>
                          </div>
                        </div>
                        <Badge 
                          variant={formattedPrediction.isReal ? "default" : "destructive"}
                          className="text-2xl px-6 py-3 font-bold shadow-lg"
                        >
                          {formattedPrediction.confidence}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between text-base">
                          <span className="text-muted-foreground font-medium">Confidence Level</span>
                          <span className="font-bold text-lg">{formattedPrediction.confidence}%</span>
                        </div>
                        <div className="relative w-full bg-secondary/50 rounded-full h-4 overflow-hidden border border-border/50">
                          <div 
                            className={`h-full transition-all duration-1500 ease-out relative ${
                              formattedPrediction.isReal ? 'bg-gradient-to-r from-accent to-accent-glow' : 'bg-gradient-to-r from-destructive to-destructive-glow'
                            }`}
                            style={{ width: `${formattedPrediction.confidence}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-border-beam"></div>
                          </div>
                        </div>
                      </div>

                      {prediction && typeof prediction === "object" && (
                        <details className="mt-8">
                          <summary className="cursor-pointer text-base text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-2">
                            <span>View Raw Prediction Data</span>
                          </summary>
                          <div className="mt-4 glass-effect p-6 rounded-xl border border-border/50">
                            <pre className="text-sm whitespace-pre-wrap break-words font-mono text-muted-foreground">
                              {JSON.stringify(prediction, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="p-8 glass-effect rounded-2xl border-2 border-destructive glow-destructive animate-fade-in-up">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <XCircle className="h-10 w-10 text-destructive-glow" />
                        <div className="absolute inset-0 animate-ping opacity-20">
                          <XCircle className="h-10 w-10 text-destructive" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-destructive mb-1">Analysis Failed</h3>
                        <p className="text-base text-muted-foreground">Please try again or use a different image</p>
                      </div>
                    </div>
                  </div>
                )}

                {(status === "success" || status === "error") && (
                  <Button 
                    onClick={handleReset} 
                    variant="outline" 
                    className="w-full h-14 text-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 font-semibold" 
                    size="lg"
                  >
                    <Upload className="mr-3 h-6 w-6" />
                    Analyze Another Image
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 glass-effect relative z-10">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-base text-muted-foreground font-medium">
            Powered by <span className="text-primary-glow font-bold">Vision Transformer</span> • 
            Built for detecting AI-generated and manipulated images
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Advanced deep learning architecture for image authenticity verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
