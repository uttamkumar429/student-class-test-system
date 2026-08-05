import TestStatusBadge from "./TestStatusBadge";
import TestActionMenu from "./TestActionMenu";

function TestRow({
  test,
  onView,
  onEdit,
  onPublish,
  onDelete,
}) {
  return (
    <tr className="border-b hover:bg-slate-50">

      <td className="px-6 py-4 font-medium">
        {test.title}
      </td>

      <td className="px-6 py-4">
        {test.subject}
      </td>

      <td className="px-6 py-4 text-center">
        {test.totalQuestions}
      </td>

      <td className="px-6 py-4 text-center">
        {test.totalMarks}
      </td>

      <td className="px-6 py-4 text-center">
        {test.duration} min
      </td>

      <td className="px-6 py-4 text-center">
        <TestStatusBadge
          status={test.status}
        />
      </td>

      <td className="px-6 py-4">

        <TestActionMenu
          test={test}
          onView={onView}
          onEdit={onEdit}
          onPublish={onPublish}
          onDelete={onDelete}
        />

      </td>

    </tr>
  );
}

export default TestRow;