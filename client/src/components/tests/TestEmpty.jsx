import { FileText } from "lucide-react";

function TestEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">

      <FileText
        size={60}
        className="mx-auto text-slate-300"
      />

      <h2 className="mt-5 text-2xl font-bold text-slate-700">
        No Tests Found
      </h2>

      <p className="mt-3 text-slate-500">
        Create your first test to get started.
      </p>

    </div>
  );
}

export default TestEmpty;