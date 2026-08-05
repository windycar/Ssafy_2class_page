export function softenAnonymousTone(content: string) {
  const normalized = content.trim().replace(/[.!?]+$/g, "");
  const endings = [".", "요.", "습니다."];
  return `${normalized}${endings[Math.floor(Math.random() * endings.length)]}`;
}

