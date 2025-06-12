export interface WebsiteStatFormProps {
  stat: {
    label: string;
    value: string;
    description: string;
    order: number;
  };
  onChange: (stat: {
    label: string;
    value: string;
    description: string;
    order: number;
  }) => void;
  isEditing?: boolean;
  disabled?: boolean;
}

export const WebsiteStatForm = ({
  stat,
  onChange,
  isEditing = false,
  disabled = false,
}: WebsiteStatFormProps) => {
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      onChange({ ...stat, label: value });
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      onChange({ ...stat, value: value });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      onChange({ ...stat, description: value });
    }
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    onChange({ ...stat, order: Math.max(1, value) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label *
          </label>{" "}
          <input
            type="text"
            value={stat.label}
            onChange={handleLabelChange}
            maxLength={50}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:bg-gray-50 disabled:cursor-not-allowed"
            placeholder="Happy Customers"
            autoFocus={!isEditing}
          />
          <p className="text-xs text-gray-500 mt-1">
            {stat.label.length}/50 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value *
          </label>{" "}
          <input
            type="text"
            value={stat.value}
            onChange={handleValueChange}
            maxLength={20}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:bg-gray-50 disabled:cursor-not-allowed"
            placeholder="10,000+"
          />
          <p className="text-xs text-gray-500 mt-1">
            {stat.value.length}/20 characters
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>{" "}
        <input
          type="text"
          value={stat.description}
          onChange={handleDescriptionChange}
          maxLength={100}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:bg-gray-50 disabled:cursor-not-allowed"
          placeholder="Brief description of this statistic"
        />
        <p className="text-xs text-gray-500 mt-1">
          {stat.description.length}/100 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Display Order
        </label>{" "}
        <input
          type="number"
          value={stat.order}
          onChange={handleOrderChange}
          min="1"
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:bg-gray-50 disabled:cursor-not-allowed"
          placeholder="1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Order in which this stat appears on the website
        </p>
      </div>
    </div>
  );
};
