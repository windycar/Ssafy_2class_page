import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  ImagePlus,
  PenLine,
  Printer,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import type { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

type DocumentType = "confirmation" | "change";

interface EvidenceFile {
  name: string;
  kind: "image" | "pdf";
  url: string;
}

interface ConfirmationForm {
  campus: string;
  classNumber: string;
  name: string;
  birthday: string;
  attendanceDate: string;
  attendanceTime: "오전" | "오후" | "종일";
  category: "공가" | "사유";
  reason: string;
  detail: string;
  place: string;
  signatureUrl: string;
  evidenceType: string;
  evidenceFiles: EvidenceFile[];
}

const getClassNumber = (className?: string) => className?.match(/\d+/)?.[0] ?? "2";

const safeFilenamePart = (value: string, fallback: string) =>
  value.trim().replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ") || fallback;

const getFilenameDate = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 6 ? digits.slice(-6) : digits.padStart(6, "0");
};

const getFileExtension = (fileName: string, kind: EvidenceFile["kind"]) => {
  const extension = fileName.match(/\.[^./\\]+$/)?.[0]?.toLowerCase();
  return extension || (kind === "pdf" ? ".pdf" : ".jpg");
};

const getFilenameClassNumber = (value: string) => {
  const classNumber = Number.parseInt(value, 10);
  return Number.isInteger(classNumber) && classNumber > 0 ? String(classNumber) : "반";
};

const getEvidenceFilename = (form: ConfirmationForm, file: EvidenceFile, index: number) => {
  const date = form.attendanceDate ? getFilenameDate(form.attendanceDate) : "소명일자";
  const evidenceType = safeFilenamePart(form.evidenceType, "증빙자료");
  const name = safeFilenamePart(form.name, "이름");
  const campus = safeFilenamePart(form.campus, "지역");
  const classNumber = getFilenameClassNumber(form.classNumber);
  const sequence = index > 0 ? `_${index + 1}` : "";
  return `${date}_${evidenceType}_${name}[${campus}_${classNumber}반]${sequence}${getFileExtension(file.name, file.kind)}`;
};

const getDocumentFilename = (documentType: DocumentType, form: ConfirmationForm | ChangeForm) => {
  const sourceDate = documentType === "confirmation" ? form.attendanceDate : form.originalDate || form.changedDate;
  const date = sourceDate ? getFilenameDate(sourceDate) : "소명일자";
  const name = safeFilenamePart(form.name, "이름");
  const campus = safeFilenamePart(form.campus, "지역");
  const classNumber = getFilenameClassNumber(form.classNumber);
  const documentLabel = documentType === "confirmation"
    ? (safeFilenamePart((form as ConfirmationForm).evidenceType, "출결확인서"))
    : "출결변경요청서";
  return `${date}_${documentLabel}_${name}[${campus}_${classNumber}반].pdf`;
};

interface ChangeForm {
  campus: string;
  classNumber: string;
  name: string;
  birthday: string;
  reasonType: string;
  originalDate: string;
  originalTime: string;
  changedDate: string;
  changedTime: string;
  detail: string;
  signatureUrl: string;
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1259AA] focus:bg-white focus:ring-4 focus:ring-blue-100";
const labelClass = "block text-sm font-extrabold text-gray-700";
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

const formatKoreanDate = (value: string) => {
  if (!value) return "____년 __월 __일";
  const [year, month, day] = value.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

const todayLabel = () => {
  const today = new Date();
  return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
};

const dataUrlToBytes = (dataUrl: string) => {
  const separatorIndex = dataUrl.indexOf(",");
  if (separatorIndex === -1) throw new Error("잘못된 PDF 데이터입니다.");
  const binary = atob(dataUrl.slice(separatorIndex + 1));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
};

const PDF_PREVIEW_PAGE_LIMIT = 4;

async function renderPdfPreviewPages(dataUrl: string) {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await getDocument({
    data: dataUrlToBytes(dataUrl),
    disableWorker: true,
    useSystemFonts: true,
  }).promise;
  const pageUrls: string[] = [];
  const previewPageCount = Math.min(pdf.numPages, PDF_PREVIEW_PAGE_LIMIT);

  for (let pageNumber = 1; pageNumber <= previewPageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.35 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("PDF 미리보기 캔버스를 만들 수 없습니다.");
    await page.render({ canvasContext: context, viewport }).promise;
    pageUrls.push(canvas.toDataURL("image/png"));
  }

  await pdf.destroy();
  return { pageUrls, totalPageCount: pdf.numPages };
}

async function appendCanvasToPdf(pdfDocument: PDFDocument, canvas: HTMLCanvasElement) {
  const pixelsPerPoint = canvas.width / A4_WIDTH;
  const pagePixelHeight = Math.max(1, Math.floor(A4_HEIGHT * pixelsPerPoint));

  for (let top = 0; top < canvas.height; top += pagePixelHeight) {
    const sliceHeight = Math.min(pagePixelHeight, canvas.height - top);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = sliceHeight;
    const context = slice.getContext("2d");
    if (!context) throw new Error("출결 서류 이미지를 만들 수 없습니다.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, slice.width, slice.height);
    context.drawImage(canvas, 0, top, canvas.width, sliceHeight, 0, 0, slice.width, slice.height);

    const image = await pdfDocument.embedPng(slice.toDataURL("image/png"));
    const page = pdfDocument.addPage([A4_WIDTH, A4_HEIGHT]);
    const imageHeight = sliceHeight / pixelsPerPoint;
    page.drawImage(image, { x: 0, y: A4_HEIGHT - imageHeight, width: A4_WIDTH, height: imageHeight });
  }
}

type Html2Canvas = typeof import("html2canvas").default;

const containsUnsupportedColorFunction = (value: string) =>
  /\b(?:oklch|oklab|lab|lch|color)\(/i.test(value);

const sanitizeHtml2CanvasClone = (clonedDocument: Document) => {
  const clonedRoot = clonedDocument.querySelector<HTMLElement>(".attendance-print-root");
  if (!clonedRoot) return;

  clonedRoot.style.color = "#111827";
  clonedRoot.style.backgroundColor = "#ffffff";
  clonedRoot.style.boxShadow = "none";

  clonedRoot.querySelectorAll<HTMLElement>("*").forEach((element) => {
    const styles = clonedDocument.defaultView?.getComputedStyle(element);
    if (!styles) return;

    if (containsUnsupportedColorFunction(styles.color)) element.style.color = "#111827";
    if (containsUnsupportedColorFunction(styles.backgroundColor)) element.style.backgroundColor = "transparent";
    if (containsUnsupportedColorFunction(styles.borderTopColor)) element.style.borderTopColor = "#e5e7eb";
    if (containsUnsupportedColorFunction(styles.borderRightColor)) element.style.borderRightColor = "#e5e7eb";
    if (containsUnsupportedColorFunction(styles.borderBottomColor)) element.style.borderBottomColor = "#e5e7eb";
    if (containsUnsupportedColorFunction(styles.borderLeftColor)) element.style.borderLeftColor = "#e5e7eb";
    if (containsUnsupportedColorFunction(styles.outlineColor)) element.style.outlineColor = "#e5e7eb";
    if (containsUnsupportedColorFunction(styles.boxShadow)) element.style.boxShadow = "none";
    if (containsUnsupportedColorFunction(styles.textShadow)) element.style.textShadow = "none";
    if (containsUnsupportedColorFunction(styles.backgroundImage)) element.style.backgroundImage = "none";
  });
};

const canvasHasVisibleContent = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");
  if (!context || canvas.width === 0 || canvas.height === 0) return false;

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const sampleStride = 4 * 32;
  for (let index = 0; index < pixels.length; index += sampleStride) {
    const alpha = pixels[index + 3];
    if (alpha > 0 && (pixels[index] < 245 || pixels[index + 1] < 245 || pixels[index + 2] < 245)) return true;
  }
  return false;
};

const renderAttendanceCanvas = async (html2canvas: Html2Canvas, documentRoot: HTMLElement) => {
  try {
    const canvas = await html2canvas(documentRoot, {
      backgroundColor: "#ffffff",
      foreignObjectRendering: false,
      logging: false,
      onclone: sanitizeHtml2CanvasClone,
      scale: 2,
      useCORS: true,
    });

    if (!canvasHasVisibleContent(canvas)) throw new Error("PDF 캡처 결과가 비어 있습니다.");
    return canvas;
  } catch (foreignObjectError) {
    console.warn("출결 서류를 기본 방식으로 캡처하지 못해 대체 방식으로 다시 시도합니다.", foreignObjectError);
    return html2canvas(documentRoot, {
      backgroundColor: "#ffffff",
      foreignObjectRendering: true,
      logging: false,
      scale: 2,
      useCORS: true,
    });
  }
};

function SignaturePad({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const previousPointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    const image = new Image();
    image.src = value;
    image.onload = () => canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, []);

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    drawingRef.current = true;
    const point = pointFromEvent(event);
    previousPointRef.current = point;

    const context = canvasRef.current?.getContext("2d");
    if (context) {
      context.beginPath();
      context.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
      context.fillStyle = "#111827";
      context.fill();
    }
  };

  const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d");
    if (!context) return;
    const point = pointFromEvent(event);
    context.beginPath();
    context.moveTo(previousPointRef.current.x, previousPointRef.current.y);
    context.lineTo(point.x, point.y);
    context.strokeStyle = "#111827";
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    previousPointRef.current = point;
  };

  const finishDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <canvas
        ref={canvasRef}
        width={560}
        height={170}
        className="block h-28 w-full touch-none cursor-crosshair"
        aria-label="서명 입력란"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={finishDrawing}
        onPointerCancel={finishDrawing}
        onPointerLeave={finishDrawing}
      />
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-3 py-2">
        <span className="text-xs text-gray-400">마우스나 손가락으로 서명하세요.</span>
        <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#1259AA]">
          <RotateCcw className="h-3.5 w-3.5" /> 다시 쓰기
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className={labelClass}><span>{label}</span>{children}</label>;
}

export default function AttendanceDocumentView() {
  const { currentUser } = useAuth();
  const [documentType, setDocumentType] = useState<DocumentType>("confirmation");
  const [previewReady, setPreviewReady] = useState(false);
  const [isPdfSaving, setIsPdfSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [confirmation, setConfirmation] = useState<ConfirmationForm>({
    campus: "광주",
    classNumber: "2",
    name: currentUser?.name ?? "",
    birthday: "",
    attendanceDate: "",
    attendanceTime: "종일",
    category: "공가",
    reason: "",
    detail: "",
    place: "",
    signatureUrl: "",
    evidenceType: "",
    evidenceFiles: [],
  });
  const [change, setChange] = useState<ChangeForm>({
    campus: "광주",
    classNumber: "2",
    name: currentUser?.name ?? "",
    birthday: "",
    reasonType: "입실 미클릭",
    originalDate: "",
    originalTime: "",
    changedDate: "",
    changedTime: "",
    detail: "",
    signatureUrl: "",
  });
  const lastAutoFilledNameRef = useRef(currentUser?.name ?? "");
  const lastAutoFilledClassRef = useRef(getClassNumber(currentUser?.className));

  useEffect(() => {
    if (!currentUser) return;
    const nextName = currentUser.name;
    const nextClassNumber = getClassNumber(currentUser.className);
    setConfirmation((form) => ({
      ...form,
      name: !form.name || form.name === lastAutoFilledNameRef.current ? nextName : form.name,
      classNumber: !form.classNumber || form.classNumber === lastAutoFilledClassRef.current ? nextClassNumber : form.classNumber,
    }));
    setChange((form) => ({
      ...form,
      name: !form.name || form.name === lastAutoFilledNameRef.current ? nextName : form.name,
      classNumber: !form.classNumber || form.classNumber === lastAutoFilledClassRef.current ? nextClassNumber : form.classNumber,
    }));
    lastAutoFilledNameRef.current = nextName;
    lastAutoFilledClassRef.current = nextClassNumber;
  }, [currentUser]);

  const isConfirmationValid = useMemo(
    () => Boolean(
      confirmation.campus && confirmation.classNumber && confirmation.name && confirmation.birthday &&
      confirmation.attendanceDate && confirmation.reason && confirmation.detail && confirmation.place &&
      confirmation.signatureUrl,
    ),
    [confirmation],
  );
  const isChangeValid = useMemo(
    () => Boolean(
      change.campus && change.classNumber && change.name && change.birthday && change.originalDate &&
      change.originalTime && change.changedDate && change.changedTime && change.detail && change.signatureUrl,
    ),
    [change],
  );

  const switchDocument = (type: DocumentType) => {
    setDocumentType(type);
    setPreviewReady(false);
  };

  const handleEvidence = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const imageOrPdfFiles = files.filter((file) =>
      file.type.startsWith("image/") || file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
    );
    const oversizedFiles = imageOrPdfFiles.filter((file) => file.size > 10 * 1024 * 1024);
    const acceptedFiles = imageOrPdfFiles.filter((file) => file.size <= 10 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      toast.error(`10MB를 초과한 파일 ${oversizedFiles.length}개는 제외했습니다.`);
    }
    if (acceptedFiles.length === 0) {
      if (imageOrPdfFiles.length === 0) toast.error("사진 또는 PDF 파일만 선택하세요.");
      return;
    }

    const fileReaders = acceptedFiles.map((file) => new Promise<EvidenceFile>((resolve) => {
      const isImage = file.type.startsWith("image/");
      const reader = new FileReader();
      reader.onload = () => resolve({
        name: file.name,
        kind: isImage ? "image" : "pdf",
        url: String(reader.result ?? ""),
      });
      reader.onerror = () => resolve({ name: file.name, kind: isImage ? "image" : "pdf", url: "" });
      reader.readAsDataURL(file);
    }));

    void Promise.all(fileReaders).then((newFiles) => {
      setConfirmation((form) => ({ ...form, evidenceFiles: [...form.evidenceFiles, ...newFiles] }));
    });
  };

  const removeEvidence = (indexToRemove: number) => {
    setConfirmation((form) => ({
      ...form,
      evidenceFiles: form.evidenceFiles.filter((_, index) => index !== indexToRemove),
    }));
  };

  const verifyAndPreview = () => {
    const valid = documentType === "confirmation" ? isConfirmationValid : isChangeValid;
    if (!valid) {
      toast.error("필수 항목과 서명을 모두 입력하세요.");
      return;
    }
    setPreviewReady(true);
    toast.success("서류 미리보기를 만들었습니다.");
    window.setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const saveAsPdf = async () => {
    const valid = documentType === "confirmation" ? isConfirmationValid : isChangeValid;
    if (!valid) {
      toast.error("필수 항목과 서명을 모두 입력하세요.");
      return;
    }

    setIsPdfSaving(true);
    setPreviewReady(true);

    try {
      const [{ default: html2canvas }, { PDFDocument }] = await Promise.all([
        import("html2canvas"),
        import("pdf-lib"),
      ]);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 100));
      const documentRoot = previewRef.current?.querySelector<HTMLElement>(".attendance-print-root");
      if (!documentRoot) throw new Error("출결 서류 미리보기를 찾을 수 없습니다.");

      const canvas = await renderAttendanceCanvas(html2canvas, documentRoot);
      const pdfDocument = await PDFDocument.create();
      await appendCanvasToPdf(pdfDocument, canvas);

      const pdfFiles = documentType === "confirmation"
        ? confirmation.evidenceFiles.filter((file) => file.kind === "pdf" && file.url)
        : [];
      let appendedPdfCount = 0;
      let failedPdfCount = 0;

      for (const file of pdfFiles) {
        try {
          const attachment = await PDFDocument.load(dataUrlToBytes(file.url));
          const pages = await pdfDocument.copyPages(attachment, attachment.getPageIndices());
          pages.forEach((page) => pdfDocument.addPage(page));
          appendedPdfCount += 1;
        } catch (error) {
          failedPdfCount += 1;
          console.error(`PDF 증빙자료를 병합하지 못했습니다: ${file.name}`, error);
        }
      }

      const pdfBytes = await pdfDocument.save();
      const downloadUrl = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = downloadUrl;
      const filenameForm = documentType === "confirmation" ? confirmation : change;
      link.download = getDocumentFilename(documentType, filenameForm);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

      if (failedPdfCount > 0) {
        toast.warning(`출결 서류는 저장했지만 PDF ${failedPdfCount}개는 병합하지 못했습니다.`);
      } else {
        toast.success(`PDF 저장 완료${appendedPdfCount > 0 ? ` · 증빙 PDF ${appendedPdfCount}개 병합` : ""}`);
      }
    } catch (error) {
      console.error("출결 서류 PDF 생성에 실패했습니다.", error);
      toast.error("PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.");
    } finally {
      setIsPdfSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="attendance-no-print relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b315f] via-[#1259AA] to-[#2877c7] px-6 py-7 text-white shadow-lg sm:px-8">
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white/15"><ClipboardCheck className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-bold tracking-widest text-blue-200">SSAFY ATTENDANCE DOCUMENT</p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">출결 서류 만들기</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">필요한 내용을 입력하고 서명하면 출결확인서 또는 출결변경요청서를 바로 인쇄하거나 PDF로 저장할 수 있습니다.</p>
          </div>
        </div>
      </section>

      <div className="attendance-no-print grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(560px,1.08fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1.5">
            {([
              ["confirmation", "출결확인서", FileCheck2],
              ["change", "출결변경요청서", CalendarCheck],
            ] as const).map(([type, label, Icon]) => (
              <button
                key={type}
                type="button"
                onClick={() => switchDocument(type)}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold transition ${documentType === type ? "bg-white text-[#1259AA] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          {documentType === "confirmation" ? (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="지역"><input className={inputClass} value={confirmation.campus} onChange={(event) => setConfirmation({ ...confirmation, campus: event.target.value })} placeholder="예: 광주" /></Field>
                <Field label="반"><input className={inputClass} type="number" min="1" value={confirmation.classNumber} onChange={(event) => setConfirmation({ ...confirmation, classNumber: event.target.value })} /></Field>
                <Field label="성명"><input className={inputClass} value={confirmation.name} onChange={(event) => setConfirmation({ ...confirmation, name: event.target.value })} /></Field>
                <Field label="생년월일"><input className={inputClass} value={confirmation.birthday} onChange={(event) => setConfirmation({ ...confirmation, birthday: event.target.value })} placeholder="YY.MM.DD" /></Field>
                <Field label="결석 일자"><input className={inputClass} type="date" value={confirmation.attendanceDate} onChange={(event) => setConfirmation({ ...confirmation, attendanceDate: event.target.value })} /></Field>
                <Field label="시간 구분"><select className={inputClass} value={confirmation.attendanceTime} onChange={(event) => setConfirmation({ ...confirmation, attendanceTime: event.target.value as ConfirmationForm["attendanceTime"] })}><option>오전</option><option>오후</option><option>종일</option></select></Field>
                <Field label="결석 구분"><select className={inputClass} value={confirmation.category} onChange={(event) => setConfirmation({ ...confirmation, category: event.target.value as ConfirmationForm["category"] })}><option>공가</option><option>사유</option></select></Field>
                <Field label="장소"><input className={inputClass} value={confirmation.place} onChange={(event) => setConfirmation({ ...confirmation, place: event.target.value })} placeholder="예: 광주 멀티캠퍼스" /></Field>
              </div>
              <Field label="사유"><input className={inputClass} maxLength={46} value={confirmation.reason} onChange={(event) => setConfirmation({ ...confirmation, reason: event.target.value })} placeholder="예: SSAFY 채용 면접 참석" /></Field>
              <Field label="세부 내용"><textarea className={`${inputClass} min-h-24 resize-y`} maxLength={140} value={confirmation.detail} onChange={(event) => setConfirmation({ ...confirmation, detail: event.target.value })} placeholder="결석 사유를 구체적으로 작성하세요." /></Field>
              <Field label="증빙자료 종류 (파일명에 사용)"><input className={inputClass} maxLength={30} value={confirmation.evidenceType} onChange={(event) => setConfirmation({ ...confirmation, evidenceType: event.target.value })} placeholder="예: 진료확인서, 카카오톡" /></Field>
              <div>
                <p className={labelClass}>서명</p>
                <SignaturePad value={confirmation.signatureUrl} onChange={(signatureUrl) => setConfirmation((form) => ({ ...form, signatureUrl }))} />
              </div>
              <label className={labelClass}>
                <span>증빙자료 <b className="font-medium text-gray-400">(선택)</b></span>
                <span className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-4 py-4 text-sm text-[#1259AA] hover:bg-blue-50">
                  <ImagePlus className="h-5 w-5" />
                  <span className="min-w-0 flex-1 truncate font-bold">{confirmation.evidenceFiles.length > 0 ? `${confirmation.evidenceFiles.length}개 파일 선택됨` : "사진 또는 PDF 여러 개 선택"}</span>
                  <input className="sr-only" type="file" accept="image/*,.pdf,application/pdf" multiple onChange={handleEvidence} />
                </span>
              </label>
              {confirmation.evidenceFiles.length > 0 && (
                <div className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:grid-cols-2" aria-label="선택한 증빙자료 목록">
                  {confirmation.evidenceFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                      <EvidencePreview file={file} index={index} />
                      <div className="flex items-center gap-2 border-t border-gray-100 px-3 py-2">
                        <FileText className="h-3.5 w-3.5 flex-none text-[#1259AA]" />
                        <span className="min-w-0 flex-1 truncate text-xs text-gray-600">{getEvidenceFilename(confirmation, file, index)}</span>
                        <button type="button" onClick={() => removeEvidence(index)} className="flex-none text-xs font-bold text-gray-400 hover:text-red-500">삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="지역"><input className={inputClass} value={change.campus} onChange={(event) => setChange({ ...change, campus: event.target.value })} /></Field>
                <Field label="반"><input className={inputClass} type="number" min="1" value={change.classNumber} onChange={(event) => setChange({ ...change, classNumber: event.target.value })} /></Field>
                <Field label="성명"><input className={inputClass} value={change.name} onChange={(event) => setChange({ ...change, name: event.target.value })} /></Field>
                <Field label="생년월일"><input className={inputClass} value={change.birthday} onChange={(event) => setChange({ ...change, birthday: event.target.value })} placeholder="YY.MM.DD" /></Field>
              </div>
              <Field label="변경 사유 유형"><select className={inputClass} value={change.reasonType} onChange={(event) => setChange({ ...change, reasonType: event.target.value })}><option>입실 미클릭</option><option>입실 오클릭</option><option>퇴실 미클릭</option><option>퇴실 오클릭</option><option>기타</option></select></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-3 text-sm font-black text-gray-800">현재 출결 일시</p>
                  <div className="space-y-3"><input aria-label="현재 출결 날짜" className={inputClass} type="date" value={change.originalDate} onChange={(event) => setChange({ ...change, originalDate: event.target.value })} /><input aria-label="현재 출결 시간" className={inputClass} type="time" value={change.originalTime} onChange={(event) => setChange({ ...change, originalTime: event.target.value })} /></div>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
                  <p className="mb-3 text-sm font-black text-[#1259AA]">변경할 출결 일시</p>
                  <div className="space-y-3"><input aria-label="변경할 출결 날짜" className={inputClass} type="date" value={change.changedDate} onChange={(event) => setChange({ ...change, changedDate: event.target.value })} /><input aria-label="변경할 출결 시간" className={inputClass} type="time" value={change.changedTime} onChange={(event) => setChange({ ...change, changedTime: event.target.value })} /></div>
                </div>
              </div>
              <Field label="변경 상세 사유"><textarea className={`${inputClass} min-h-28 resize-y`} maxLength={140} value={change.detail} onChange={(event) => setChange({ ...change, detail: event.target.value })} placeholder="변경이 필요한 이유를 구체적으로 작성하세요." /></Field>
              <div>
                <p className={labelClass}>서명</p>
                <SignaturePad value={change.signatureUrl} onChange={(signatureUrl) => setChange((form) => ({ ...form, signatureUrl }))} />
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
            <button type="button" onClick={verifyAndPreview} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1259AA] px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-blue-200 hover:bg-[#0d4a8f]"><FileText className="h-4 w-4" /> 미리보기 만들기</button>
            <button type="button" onClick={() => void saveAsPdf()} disabled={isPdfSaving} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-extrabold text-gray-700 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"><Printer className="h-4 w-4" /> {isPdfSaving ? "PDF 만드는 중..." : "PDF로 저장"}</button>
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-gray-400"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none" /> 입력한 정보와 파일은 서버에 저장되지 않습니다. 선택한 PDF는 출결 서류 뒤에 원본 페이지로 병합됩니다.</p>
        </section>

        <div ref={previewRef} className="scroll-mt-24">
          <div className="mb-3 flex items-center justify-between">
            <div><h2 className="font-black text-gray-900">문서 미리보기</h2><p className="text-xs text-gray-400">A4 용지 기준</p></div>
            {previewReady && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> 작성 완료</span>}
          </div>
          {previewReady ? (
            documentType === "confirmation" ? <ConfirmationDocument form={confirmation} /> : <ChangeDocument form={change} />
          ) : (
            <div className="flex min-h-[520px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center">
              <div><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1259AA]"><PenLine className="h-6 w-6" /></div><h3 className="mt-4 font-black text-gray-800">내용을 입력해 주세요</h3><p className="mt-2 text-sm leading-6 text-gray-400">필수 항목과 서명을 입력한 뒤<br />미리보기 만들기를 누르면 완성된 문서가 표시됩니다.</p></div>
            </div>
          )}
        </div>
      </div>

      {previewReady && (
        <div className="hidden print:block">
          {documentType === "confirmation" ? <ConfirmationDocument form={confirmation} /> : <ChangeDocument form={change} />}
        </div>
      )}
    </div>
  );
}

function DocumentShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="attendance-print-root mx-auto min-h-[760px] w-full max-w-[720px] bg-white px-8 py-10 text-gray-950 shadow-xl ring-1 ring-black/5 sm:px-12 sm:py-14">
      <header className="border-b-2 border-gray-900 pb-5 text-center">
        <p className="text-[11px] font-bold tracking-[0.28em] text-gray-500">SAMSUNG SOFTWARE ACADEMY FOR YOUTH</p>
        <h2 className="mt-4 text-3xl font-black tracking-[0.14em]">{title}</h2>
      </header>
      {children}
    </article>
  );
}

function ConfirmationDocument({ form }: { form: ConfirmationForm }) {
  return (
    <DocumentShell title="출 결 확 인 서">
      <table className="mt-8 w-full border-collapse text-sm">
        <tbody>
          <DocumentRow label="소속" value={`SSAFY ${form.campus} 캠퍼스 ${form.classNumber}반`} label2="성명" value2={form.name} />
          <DocumentRow label="생년월일" value={form.birthday} label2="결석 일시" value2={`${formatKoreanDate(form.attendanceDate)} ${form.attendanceTime}`} />
          <DocumentRow label="구분" value={form.category} label2="장소" value2={form.place} />
          <DocumentRow label="사유" value={form.reason} wide />
          <DocumentRow label="세부 내용" value={form.detail} wide multiline />
        </tbody>
      </table>
      <p className="mt-10 text-center text-[15px] leading-8">위와 같은 사유로 출결 사실을 확인하며,<br />작성한 내용에 거짓이 없음을 확인합니다.</p>
      <p className="mt-8 text-center text-sm font-bold tracking-wide">{todayLabel()}</p>
      <div className="mt-7 flex items-center justify-end gap-5 text-sm"><span>신청인</span><strong className="min-w-20 text-center text-base">{form.name}</strong>{form.signatureUrl ? <img src={form.signatureUrl} alt="신청인 서명" className="h-14 w-32 object-contain" /> : <span>(서명)</span>}</div>
      {form.evidenceFiles.length > 0 && (
        <div className="mt-8 border-t border-dashed border-gray-300 pt-4">
          <p className="text-xs font-bold text-gray-600">첨부 증빙 ({form.evidenceFiles.length}개)</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {form.evidenceFiles.map((file, index) => (
              file.kind === "image" && file.url ? (
                <figure key={`${file.name}-${index}`} className="min-w-0 overflow-hidden rounded border border-gray-200 p-2">
                  <img src={file.url} alt={`첨부 증빙자료 ${index + 1}: ${file.name}`} className="h-40 w-full object-contain" />
                  <figcaption className="mt-1 break-all text-[11px] text-gray-500">{getEvidenceFilename(form, file, index)}</figcaption>
                </figure>
              ) : file.kind === "pdf" ? (
                <div key={`${file.name}-${index}`} className="min-w-0 overflow-hidden rounded border border-gray-200 bg-gray-50 p-3">
                  <PdfPagesPreview url={file.url} label={`첨부 PDF ${index + 1}`} />
                  <p className="mt-2 break-all text-[11px] text-gray-500">저장 시 이 문서 뒤에 원본 페이지로 병합됩니다.</p>
                  <p className="border-t border-gray-200 pt-2 text-[11px] text-gray-500">{getEvidenceFilename(form, file, index)}</p>
                </div>
              ) : (
                <p key={`${file.name}-${index}`} className="rounded border border-gray-200 p-3 text-xs text-gray-600">첨부파일: {file.name}</p>
              )
            ))}
          </div>
        </div>
      )}
      <p className="mt-10 text-center text-lg font-black tracking-[0.18em]">SSAFY 광주 캠퍼스</p>
    </DocumentShell>
  );
}

function EvidencePreview({ file, index }: { file: EvidenceFile; index: number }) {
  if (file.kind === "image" && file.url) {
    return <img src={file.url} alt={`선택한 증빙사진 ${index + 1}: ${file.name}`} className="h-36 w-full bg-gray-50 object-contain" />;
  }

  if (file.kind === "pdf" && file.url) {
    return <PdfPagesPreview url={file.url} label={`선택한 PDF ${index + 1}: ${file.name}`} />;
  }

  return <div className="flex h-36 items-center justify-center bg-gray-50 p-3 text-center text-xs text-gray-500">미리보기를 불러올 수 없습니다.</div>;
}

function PdfPagesPreview({ url, label }: { url: string; label: string }) {
  const [pageUrls, setPageUrls] = useState<string[]>([]);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);
    setPageUrls([]);
    setTotalPageCount(0);

    void renderPdfPreviewPages(url)
      .then(({ pageUrls: nextPageUrls, totalPageCount: nextTotalPageCount }) => {
        if (!isMounted) return;
        setPageUrls(nextPageUrls);
        setTotalPageCount(nextTotalPageCount);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("PDF 미리보기를 만들지 못했습니다.", error);
        setHasError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  if (isLoading) {
    return <div className="flex h-36 items-center justify-center bg-gray-50 p-3 text-center text-xs text-gray-500" aria-label={`${label} 불러오는 중`}>PDF 페이지를 불러오는 중...</div>;
  }

  if (hasError || pageUrls.length === 0) {
    return <div className="flex h-36 items-center justify-center bg-gray-50 p-3 text-center text-xs text-red-500" role="img" aria-label={`${label} 미리보기 실패`}>PDF 페이지를 표시하지 못했습니다.</div>;
  }

  return (
    <div className="max-h-80 space-y-2 overflow-y-auto bg-gray-100 p-2" aria-label={label}>
      {pageUrls.map((pageUrl, index) => (
        <img key={`${pageUrl.slice(0, 24)}-${index}`} src={pageUrl} alt={`${label} ${index + 1}페이지`} className="block w-full bg-white object-contain shadow-sm" />
      ))}
      {totalPageCount > pageUrls.length && <p className="px-1 text-center text-[11px] text-gray-500">총 {totalPageCount}페이지 중 앞 {pageUrls.length}페이지 미리보기</p>}
    </div>
  );
}

function ChangeDocument({ form }: { form: ChangeForm }) {
  return (
    <DocumentShell title="출결변경요청서">
      <table className="mt-8 w-full border-collapse text-sm">
        <tbody>
          <DocumentRow label="소속" value={`SSAFY ${form.campus} 캠퍼스 ${form.classNumber}반`} label2="성명" value2={form.name} />
          <DocumentRow label="생년월일" value={form.birthday} label2="변경 유형" value2={form.reasonType} />
          <DocumentRow label="현재 기록" value={`${formatKoreanDate(form.originalDate)} ${form.originalTime}`} wide />
          <DocumentRow label="변경 요청" value={`${formatKoreanDate(form.changedDate)} ${form.changedTime}`} wide emphasize />
          <DocumentRow label="변경 사유" value={form.detail} wide multiline />
        </tbody>
      </table>
      <p className="mt-12 text-center text-[15px] leading-8">위와 같이 출결 기록의 변경을 요청합니다.<br />작성한 내용에 거짓이 없음을 확인합니다.</p>
      <p className="mt-9 text-center text-sm font-bold tracking-wide">{todayLabel()}</p>
      <div className="mt-8 flex items-center justify-end gap-5 text-sm"><span>신청인</span><strong className="min-w-20 text-center text-base">{form.name}</strong>{form.signatureUrl ? <img src={form.signatureUrl} alt="신청인 서명" className="h-14 w-32 object-contain" /> : <span>(서명)</span>}</div>
      <p className="mt-20 text-center text-lg font-black tracking-[0.18em]">SSAFY 광주 캠퍼스</p>
    </DocumentShell>
  );
}

function DocumentRow({
  label,
  value,
  label2,
  value2,
  wide = false,
  multiline = false,
  emphasize = false,
}: {
  label: string;
  value: string;
  label2?: string;
  value2?: string;
  wide?: boolean;
  multiline?: boolean;
  emphasize?: boolean;
}) {
  const valueClass = `border border-gray-400 px-3 py-3 ${multiline ? "h-28 whitespace-pre-wrap align-top leading-6" : ""} ${emphasize ? "bg-blue-50 font-extrabold text-[#0d4a8f]" : ""}`;
  return (
    <tr>
      <th className="w-24 border border-gray-400 bg-gray-100 px-3 py-3 text-center font-extrabold">{label}</th>
      <td className={valueClass} colSpan={wide ? 3 : 1}>{value || "-"}</td>
      {!wide && <><th className="w-24 border border-gray-400 bg-gray-100 px-3 py-3 text-center font-extrabold">{label2}</th><td className={valueClass}>{value2 || "-"}</td></>}
    </tr>
  );
}
