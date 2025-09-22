// inside your CreatorDashboard component

// State to store queued withdrawals
const [queuedWithdrawals, setQueuedWithdrawals] = useState<
  { userId: string; address: string; timestamp: number }[]
>(() => {
  const stored = localStorage.getItem("queuedWithdrawals");
  return stored ? JSON.parse(stored) : [];
});

// Listen for online events to process queued withdrawals
useEffect(() => {
  const handleOnline = () => {
    processQueuedWithdrawals();
  };
  window.addEventListener("online", handleOnline);
  return () => window.removeEventListener("online", handleOnline);
}, [queuedWithdrawals]);

// Function to queue withdrawal
const queueWithdrawal = (address: string) => {
  const newQueue = [
    ...queuedWithdrawals,
    { userId, address, timestamp: Date.now() },
  ];
  setQueuedWithdrawals(newQueue);
  localStorage.setItem("queuedWithdrawals", JSON.stringify(newQueue));
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 3000);
};

// Function to process queued withdrawals
const processQueuedWithdrawals = async () => {
  if (!navigator.onLine || queuedWithdrawals.length === 0) return;

  const remainingQueue: typeof queuedWithdrawals = [];

  for (const item of queuedWithdrawals) {
    try {
      const result = await MonetizationManager.processWithdrawal(
        item.userId,
        item.address,
      );
      if (!result.success) {
        // Keep failed withdrawals in queue
        remainingQueue.push(item);
      }
    } catch {
      remainingQueue.push(item);
    }
  }

  setQueuedWithdrawals(remainingQueue);
  localStorage.setItem("queuedWithdrawals", JSON.stringify(remainingQueue));
  if (remainingQueue.length === 0) await loadEarnings(); // refresh earnings if all successful
};

// Updated handleWithdrawal
const handleWithdrawal = async () => {
  const trimmedAddress = piWalletAddress.trim();
  if (!trimmedAddress) return setError("Please enter your Pi wallet address");
  if (!validateWalletAddress(trimmedAddress))
    return setError("Invalid Pi wallet address");
  if (!earnings || earnings.pendingWithdrawal < MIN_WITHDRAWAL)
    return setError(`Minimum withdrawal: π ${MIN_WITHDRAWAL}`);

  setIsWithdrawing(true);
  setError(null);

  try {
    if (!navigator.onLine) {
      // Queue offline withdrawal
      queueWithdrawal(trimmedAddress);
      setPiWalletAddress("");
    } else {
      const result = await MonetizationManager.processWithdrawal(
        userId,
        trimmedAddress,
      );
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        await loadEarnings();
        setPiWalletAddress("");
      } else {
        setError(result.error || "Withdrawal failed");
      }
    }
  } catch {
    setError("An error occurred during withdrawal");
  } finally {
    setIsWithdrawing(false);
  }
};
