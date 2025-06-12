export interface FaqFormProps {
  faq: {
    question: string;
    answer: string;
  };
  onChange: (faq: { question: string; answer: string }) => void;
  isEditing?: boolean;
  disabled?: boolean;
}

export const FaqForm = ({
  faq,
  onChange,
  isEditing = false,
  disabled = false,
}: FaqFormProps) => {
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      onChange({ ...faq, question: value });
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      onChange({ ...faq, answer: value });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question *
        </label>{" "}
        <input
          type="text"
          value={faq.question}
          onChange={handleQuestionChange}
          maxLength={200}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter your question here..."
          autoFocus={!isEditing}
        />
        <p className="text-xs text-gray-500 mt-1">
          {faq.question.length}/200 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer *
        </label>{" "}
        <textarea
          rows={4}
          value={faq.answer}
          onChange={handleAnswerChange}
          maxLength={500}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Provide a detailed answer to this question..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {faq.answer.length}/500 characters
        </p>
      </div>
    </div>
  );
};
