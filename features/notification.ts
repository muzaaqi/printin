export const playNotificationSound = () => {
  const audio = new Audio("/sounds/ka-ching.mp3");
  audio.play().catch((err) => console.error("Gagal memutar audio:", err));
}
