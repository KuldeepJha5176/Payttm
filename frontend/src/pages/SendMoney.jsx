import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export const SendMoney = () => {
    const [amount, setAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const navigate = useNavigate();

    // Fetch the user's balance when component mounts
    useEffect(() => {
        fetchUserBalance();
    }, []);

    const fetchUserBalance = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/v1/account/balance",
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            setUserBalance(response.data.balance);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        }
    };

    const handleTransfer = () => {
        // Reset any previous errors
        setError("");
        
        // Check if amount is valid
        if (!amount || amount <= 0) {
            setError("Please enter a valid amount");
            return;
        }
        
        // Check if user has sufficient balance
        if (Number(amount) > userBalance) {
            setError("Insufficient Balance! You don't have enough funds.");
            return;
        }

        setIsLoading(true);
        axios
            .post(
                "http://localhost:3000/api/v1/account/transfer",
                {
                    to: id,
                    amount: Number(amount),
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            )
            .then((response) => {
                setIsLoading(false);
                // Redirect directly to the TransferSuccess page after a successful transfer
                navigate("/transfer-success"); 
            })
            .catch((error) => {
                setIsLoading(false);
                setError(error.response?.data?.message || "Transfer failed. Please try again.");
                console.error("Transfer failed:", error);
            });
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">
                                    {name && name[0] ? name[0].toUpperCase() : "?"}
                                </span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-500">Your Balance</span>
                                <span className="font-medium">₹{userBalance}</span>
                            </div>
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                />
                            </div>
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                                    {error}
                                </div>
                            )}
                            <button
                                onClick={handleTransfer}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Initiate Transfer"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};