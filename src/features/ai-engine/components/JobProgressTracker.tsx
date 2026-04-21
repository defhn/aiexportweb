"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, AlertCircle, RefreshCw, Layers } from "lucide-react";
import Link from "next/link";

// 对应后端的 ContentJobRow
type JobData = {
  jobId: number;
  status: string;
  statusLabel: string;
  progressPercent: number;
  taskType: string;
  targetBlogPostId: number | null;
  errorLog: string | null;
  updatedAt: string;
};

export function JobProgressTracker() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);

  // 简单轮询逻辑
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/ai/content-jobs");
        const data = await res.json();
        if (data.jobs) {
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
        // 每 3 秒轮询一次
        timeoutId = setTimeout(fetchJobs, 3000);
      }
    };

    void fetchJobs();
    return () => clearTimeout(timeoutId);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <CircleDashed className="h-5 w-5 text-stone-300" />;
      default:
        // extracting, drafting, reviewing, injecting
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-stone-50 text-stone-600 border-stone-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-[1.5rem] border border-stone-200 bg-white shadow-sm">
        <RefreshCw className="h-5 w-5 animate-spin text-stone-400" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-stone-200 bg-white py-12 shadow-sm text-center">
        <Layers className="h-10 w-10 text-stone-300 mb-3" />
        <h3 className="text-sm font-semibold text-stone-900">No jobs found</h3>
        <p className="text-sm text-stone-500 mt-1">Start a new pipeline job from the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.jobId}
          className="relative overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          {/* Progress Bar Background */}
          {job.status !== "failed" && job.status !== "completed" && (
            <div
              className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000 ease-in-out"
              style={{ width: `${job.progressPercent}%` }}
            />
          )}

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-50">
              {getStatusIcon(job.status)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-stone-900 truncate">
                  Task #{job.jobId}: {job.taskType}
                </p>
                <div
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.statusLabel || job.status} ({job.progressPercent}%)
                </div>
              </div>

              {job.status === "failed" && job.errorLog && (
                <p className="mt-2 text-xs text-red-600 font-mono bg-red-50 p-2 rounded-lg break-all">
                  {job.errorLog}
                </p>
              )}

              {job.status === "completed" && job.targetBlogPostId && (
                <div className="mt-2">
                  <Link
                    href={`/admin/blog/${job.targetBlogPostId}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2"
                  >
                    View generated blog post &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
