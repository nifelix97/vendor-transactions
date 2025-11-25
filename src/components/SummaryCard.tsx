interface SummaryCardProps {
  title: string;
  amount: number;
  currency: string;
  iconColor: string;
  icon: React.ReactNode;
  amountColor?: string;
}

const SummaryCard = ({ 
  title, 
  amount, 
  currency, 
  iconColor, 
  icon,
  amountColor = 'text-gray-900'
}: SummaryCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`rounded-lg p-2 ${iconColor}`}>
          {icon}
        </div>
      </div>
      <p className={`mb-1 text-2xl font-bold ${amountColor}`}>
        {currency} {amount.toLocaleString()}
      </p>
    </div>
  );
};

export default SummaryCard;
