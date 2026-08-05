function CustomTooltip({

  active,

  payload,

  label,

}) {

  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {

    return null;

  }

  return (

    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">

      <p className="font-semibold text-slate-900">

        {label}

      </p>

      <p className="mt-2 text-blue-600">

        {payload[0].value}

      </p>

    </div>

  );

}

export default CustomTooltip;