import {
  BookOpen,
  Clock,
  Calendar,
  FileText,
  Award,
  User,
} from "lucide-react";

import TestStatusBadge from "./TestStatusBadge";

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="rounded-lg bg-white p-2 shadow-sm">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {value || "--"}
        </p>

      </div>

    </div>
  );
}

function TestDetailsCard({ test }) {
  if (!test) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            {test.title}
          </h2>

          <p className="mt-1 text-slate-500">
            Complete examination information
          </p>

        </div>

        <TestStatusBadge
          status={test.status}
        />

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        <InfoItem
          icon={
            <BookOpen
              size={20}
              className="text-blue-600"
            />
          }
          label="Subject"
          value={test.subject}
        />

        <InfoItem
          icon={
            <Clock
              size={20}
              className="text-green-600"
            />
          }
          label="Duration"
          value={`${test.duration} Minutes`}
        />

        <InfoItem
          icon={
            <Award
              size={20}
              className="text-amber-600"
            />
          }
          label="Total Marks"
          value={test.totalMarks}
        />

        <InfoItem
          icon={
            <FileText
              size={20}
              className="text-purple-600"
            />
          }
          label="Questions"
          value={test.totalQuestions}
        />

        <InfoItem
          icon={
            <Calendar
              size={20}
              className="text-cyan-600"
            />
          }
          label="Start Time"
          value={
            test.startTime
              ? new Date(
                  test.startTime
                ).toLocaleString()
              : "--"
          }
        />

        <InfoItem
          icon={
            <Calendar
              size={20}
              className="text-red-600"
            />
          }
          label="End Time"
          value={
            test.endTime
              ? new Date(
                  test.endTime
                ).toLocaleString()
              : "--"
          }
        />

        <InfoItem
          icon={
            <User
              size={20}
              className="text-indigo-600"
            />
          }
          label="Created By"
          value={
            test.createdBy?.fullName ||
            "--"
          }
        />

        <InfoItem
          icon={
            <Calendar
              size={20}
              className="text-slate-600"
            />
          }
          label="Created At"
          value={
            test.createdAt
              ? new Date(
                  test.createdAt
                ).toLocaleString()
              : "--"
          }
        />

      </div>

      {test.description && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">

          <h3 className="mb-3 text-lg font-semibold text-slate-800">
            Description
          </h3>

          <p className="leading-7 text-slate-600">
            {test.description}
          </p>

        </div>
      )}

    </div>
  );
}

export default TestDetailsCard;