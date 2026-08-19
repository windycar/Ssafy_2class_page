export const SPECIAL_MOCK_EXAM_MATH_SEGMENT_PATTERN =
  /(\$\$[\s\S]+?\$\$|\$[^$\r\n]+?\$)/g;

type MathReplacement = {
  pattern: RegExp;
  math: string | ((match: string, capture: string) => string);
};

const LEGACY_MATH_REPLACEMENTS: MathReplacement[] = [
  {
    pattern: /R\^2\s*=\s*1\s*-\s*\(SS_res\s*\/\s*SS_tot\)/g,
    math: String.raw`R^2 = 1 - \frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}}`,
  },
  {
    pattern: /beta\s*=\s*\(X\^T X\)\^\(-1\) X\^T y/g,
    math: String.raw`\beta = (X^\mathsf{T}X)^{-1}X^\mathsf{T}y`,
  },
  {
    pattern: /Y\s*=\s*f\*\(X\)\s*\+\s*e/g,
    math: String.raw`Y = f^{*}(X) + \varepsilon`,
  },
  {
    pattern:
      /Y\s*=\s*beta_0\s*\+\s*beta_1 X_1\s*\+\s*\.\.\.\s*\+\s*beta_p X_p\s*\+\s*epsilon/g,
    math: String.raw`Y = \beta_0 + \beta_1X_1 + \cdots + \beta_pX_p + \varepsilon`,
  },
  {
    pattern: /dH\/dx\s*=\s*dF\/dx\s*\+\s*1/g,
    math: String.raw`\frac{dH}{dx} = \frac{dF}{dx} + 1`,
  },
  {
    pattern: /H\(x\)\s*=\s*F\(x\)\s*\+\s*x/g,
    math: String.raw`H(x) = F(x) + x`,
  },
  {
    pattern: /F\(x\)\s*=\s*H\(x\)\s*-\s*x/g,
    math: String.raw`F(x) = H(x) - x`,
  },
  {
    pattern: /h_t\s*=\s*softmax\(W_xh \* x_t \+ b\)/g,
    math: String.raw`h_t = \operatorname{softmax}(W_{xh}x_t + b)`,
  },
  {
    pattern:
      /h_t\s*=\s*tanh\(W_hh \* h_\(t-1\) \+ W_xh \* x_t \+ b_h\)/g,
    math: String.raw`h_t = \tanh(W_{hh}h_{t-1} + W_{xh}x_t + b_h)`,
  },
  {
    pattern:
      /h_t\s*=\s*sigmoid\(W_hh \* h_\(t-1\)\) \* tanh\(x_t\)/g,
    math: String.raw`h_t = \sigma(W_{hh}h_{t-1})\tanh(x_t)`,
  },
  {
    pattern: /h_t\s*=\s*h_\(t-1\) \+ W_xh \* x_t/g,
    math: String.raw`h_t = h_{t-1} + W_{xh}x_t`,
  },
  {
    pattern: /1\/N\s*\+\s*1\/\(D_K\^2\)/g,
    math: String.raw`\frac{1}{N} + \frac{1}{D_K^2}`,
  },
  {
    pattern: /N\s*\/\s*\(D_K\^2\)/g,
    math: String.raw`\frac{N}{D_K^2}`,
  },
  {
    pattern: /1\s*\/\s*\(N \* D_K\)/g,
    math: String.raw`\frac{1}{ND_K}`,
  },
  {
    pattern: /\(D_K\^2\)\s*\/\s*N/g,
    math: String.raw`\frac{D_K^2}{N}`,
  },
  {
    pattern: /log\(p\/\(1-p\)\)/g,
    math: String.raw`\log\!\left(\frac{p}{1-p}\right)`,
  },
  {
    pattern: /p\/\(1-p\)/g,
    math: String.raw`\frac{p}{1-p}`,
  },
  {
    pattern: /P\(Y=k\|X\)/g,
    math: String.raw`P(Y=k\mid X)`,
  },
  {
    pattern: /sqrt\(d_k\)/g,
    math: String.raw`\sqrt{d_k}`,
  },
  {
    pattern: /sqrt\(p\)/g,
    math: String.raw`\sqrt{p}`,
  },
  {
    pattern: /X\^T X/g,
    math: String.raw`X^\mathsf{T}X`,
  },
  { pattern: /R\^2/g, math: String.raw`R^2` },
  { pattern: /SS_res/g, math: String.raw`SS_{\mathrm{res}}` },
  { pattern: /SS_tot/g, math: String.raw`SS_{\mathrm{tot}}` },
  { pattern: /F\(x\)\s*=\s*0/g, math: String.raw`F(x) = 0` },
  { pattern: /H\(x\)\s*=\s*x/g, math: String.raw`H(x) = x` },
  { pattern: /\b([HF])\(x\)/g, math: (_, name) => `${name}(x)` },
  { pattern: /\bO\(1\)/g, math: String.raw`O(1)` },
  { pattern: /\bC\^2\b/g, math: String.raw`C^2` },
  {
    pattern: /\bbeta_([0-9A-Za-z]+)\b/g,
    math: (_, subscript) => String.raw`\beta_{${subscript}}`,
  },
  { pattern: /\bepsilon\b/g, math: String.raw`\varepsilon` },
  {
    pattern: /\b([A-Za-z]+)_\(([^)]+)\)/g,
    math: (_, name) => {
      const [, base = "", subscript = ""] = _.match(
        /^([A-Za-z]+)_\(([^)]+)\)$/,
      ) ?? [];
      return `${base}_{${subscript}}`;
    },
  },
  {
    pattern: /\b([A-Za-z]+)_([0-9A-Za-z]+)(?:\^([0-9]+))?\b/g,
    math: (match) => {
      const [, base = "", subscript = "", superscript] = match.match(
        /^([A-Za-z]+)_([0-9A-Za-z]+)(?:\^([0-9]+))?$/,
      ) ?? [];
      return `${base}_{${subscript}}${superscript ? `^{${superscript}}` : ""}`;
    },
  },
];

function normalizePlainMathText(text: string) {
  const protectedMath: string[] = [];
  let normalized = text;

  LEGACY_MATH_REPLACEMENTS.forEach(({ pattern, math }) => {
    normalized = normalized.replace(pattern, (match, capture = "") => {
      const expression =
        typeof math === "function" ? math(match, capture) : math;
      const placeholder = `\uE000${protectedMath.length}\uE001`;
      protectedMath.push(`$${expression}$`);
      return placeholder;
    });
  });

  return normalized.replace(/\uE000(\d+)\uE001/g, (_, index: string) => {
    return protectedMath[Number(index)] ?? "";
  });
}

export function normalizeSpecialMockExamMath(text: string) {
  return text
    .split(SPECIAL_MOCK_EXAM_MATH_SEGMENT_PATTERN)
    .map((segment) =>
      segment.startsWith("$") && segment.endsWith("$")
        ? segment
        : normalizePlainMathText(segment),
    )
    .join("");
}
