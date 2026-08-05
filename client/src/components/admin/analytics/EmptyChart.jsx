import { BarChart3 } from "lucide-react";

function EmptyChart() {
  return (

    <div className="flex h-full flex-col items-center justify-center">

      <BarChart3
        size={54}
        className="text-slate-300"
      />

      <h3 className="mt-5 text-lg font-semibold text-slate-700">

        No Analytics Available

      </h3>

      <p className="mt-2 text-center text-sm text-slate-500">

        Data will appear once students start
        using the examination system.

      </p>

    </div>

  );
}

export default EmptyChart;