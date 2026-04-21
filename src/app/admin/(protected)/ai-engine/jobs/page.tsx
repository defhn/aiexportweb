import { type Metadata } from "next";
import { Layers } from "lucide-react";
import { getJobsBySite } from "@/features/content-jobs/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

export const metadata: Metadata = {
  title: "AI Job History",
};

export default async function AiEngineJobsPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const jobs = await getJobsBySite(currentSite.id ?? null, 50);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-600">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Task History</h1>
            <p className="mt-1 text-sm font-medium text-stone-500">
              Review past runs of the AI Content Engine.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-600">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="pb-3 px-4 font-semibold text-stone-900">Job ID</th>
              <th className="pb-3 px-4 font-semibold text-stone-900">Status</th>
              <th className="pb-3 px-4 font-semibold text-stone-900">Progress</th>
              <th className="pb-3 px-4 font-semibold text-stone-900">Created At</th>
              <th className="pb-3 px-4 font-semibold text-stone-900">Target ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-stone-400">
                  No jobs found for this site.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-stone-900">#{job.id}</td>
                  <td className="py-3 px-4">
                    <span 
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        job.status === "completed" 
                          ? "bg-green-100 text-green-700" 
                          : job.status === "failed" 
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{job.progressPercent}%</td>
                  <td className="py-3 px-4">{new Date(job.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {job.targetBlogPostId ? (
                      <a href={`/admin/blog/${job.targetBlogPostId}`} className="text-blue-600 hover:text-blue-800 underline">
                        Blog #{job.targetBlogPostId}
                      </a>
                    ) : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
