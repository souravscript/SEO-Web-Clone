"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

// Blog post status constants
const BlogStatus = {
  WAITING: "waiting",
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed"
};

export default function BlogQueueDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  
  // Status counts for dashboard cards
  const [statusCounts, setStatusCounts] = useState({
    waiting: 0,
    running: 0,
    completed: 0,
    failed: 0
  });

  // Filtered posts based on active tab
  const filteredPosts = activeTab === "all" 
    ? posts 
    : posts.filter(post => post.status === activeTab);

  // Load posts from API
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/documents/queue-status");
      const data = await res.json();
      console.log("redis data", data);
      
      // Transform queue data into post format
      const allPosts = [
        ...(Array.isArray(data.waiting) ? data.waiting : []).map((job) => ({
          id: job.id,
          title: job.data?.title || job.name || "Queued Blog Post",
          topic: job.data?.topic || "Unknown",
          userId: job.data?.userId || "",
          status: BlogStatus.WAITING,
          createdAt: job.timestamp ? new Date(parseInt(job.timestamp)).toISOString() : new Date().toISOString(),
          updatedAt: job.timestamp ? new Date(parseInt(job.timestamp)).toISOString() : new Date().toISOString()
        })),
        ...(Array.isArray(data.active) ? data.active : []).map((job) => ({
          id: job.id,
          title: job.data?.title || job.name || "Active Blog Post",
          topic: job.data?.topic || "Unknown",
          userId: job.data?.userId || "",
          status: BlogStatus.RUNNING,
          createdAt: job.timestamp ? new Date(parseInt(job.timestamp)).toISOString() : new Date().toISOString(),
          updatedAt: job.timestamp ? new Date(parseInt(job.timestamp)).toISOString() : new Date().toISOString()
        })),
        ...(Array.isArray(data.completed) ? data.completed : []).map((job) => ({
          id: job.id,
          title: job.data?.title || job.name || "Completed Blog Post",
          topic: job.data?.topic || "Unknown", 
          userId: job.data?.userId || "",
          status: BlogStatus.COMPLETED,
          createdAt: job.timestamp ? new Date(parseInt(job.timestamp)).toISOString() : new Date().toISOString(),
          updatedAt: job.finishedOn ? new Date(parseInt(job.finishedOn)).toISOString() : new Date().toISOString()
        })),
        ...(Array.isArray(data.failed) ? data.failed : []).map((job) => ({
          id: job.id,
          title: job.data?.title || job.name || "Failed Blog Post",
          topic: job.data?.topic || "Unknown",
          userId: job.data?.userId || "",
          status: BlogStatus.FAILED,
          createdAt: job.timestamp ? new Date(parseInt(job.timestamp)).toISOString() : new Date().toISOString(),
          updatedAt: job.finishedOn ? new Date(parseInt(job.finishedOn)).toISOString() : new Date().toISOString()
        }))
      ];
      
      setPosts(allPosts);
      setStatusCounts({
        waiting: data.waitingCount,
        running: data.activeCount,
        completed: data.completedCount,
        failed: data.failedCount
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching queue status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and refresh interval
  useEffect(() => {
    loadPosts();
    const interval = setInterval(loadPosts, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex gap-4">
            <Button onClick={() => loadPosts()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          )}
        </div>
      </div> */}

      <div className="grid gap-4 md:grid-cols-4 my-8">
        <StatusCard
          title="Waiting"
          count={statusCounts.waiting}
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          color="bg-blue-100 dark:bg-blue-900/20"
        />
        <StatusCard
          title="Running"
          count={statusCounts.running}
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
          color="bg-yellow-100 dark:bg-yellow-900/20"
        />
        <StatusCard
          title="Completed"
          count={statusCounts.completed}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          color="bg-green-100 dark:bg-green-900/20"
        />
        <StatusCard
          title="Failed"
          count={statusCounts.failed}
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          color="bg-red-100 dark:bg-red-900/20"
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
          <TabsTrigger value={BlogStatus.WAITING}>Waiting ({statusCounts.waiting})</TabsTrigger>
          <TabsTrigger value={BlogStatus.RUNNING}>Running ({statusCounts.running})</TabsTrigger>
          <TabsTrigger value={BlogStatus.COMPLETED}>Completed ({statusCounts.completed})</TabsTrigger>
          <TabsTrigger value={BlogStatus.FAILED}>Failed ({statusCounts.failed})</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No blog posts found</div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusCard({ title, count, icon, color }) {
  return (
    <Card className={`${color} border-none`}>
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className="rounded-full p-2 bg-background">{icon}</div>
      </CardContent>
    </Card>
  );
}

function BlogPostCard({ post }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case BlogStatus.WAITING:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            Waiting
          </Badge>
        );
      case BlogStatus.RUNNING:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            Running
          </Badge>
        );
      case BlogStatus.COMPLETED:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Completed
          </Badge>
        );
      case BlogStatus.FAILED:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{post.title}</CardTitle>
          {getStatusBadge(post.status)}
        </div>
      </CardHeader>
      <CardContent>
        {post.status === BlogStatus.WAITING && (
          <div className="flex items-center justify-center py-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="ml-2 text-sm text-muted-foreground">Waiting in queue...</span>
          </div>
        )}
        {post.status === BlogStatus.RUNNING && (
          <div className="flex items-center justify-center py-2">
            <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Generating content...</span>
          </div>
        )}
        {post.status === BlogStatus.FAILED && (
          <p className="text-sm text-red-500 mt-2">Generation failed. Please try again.</p>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0 flex justify-between">
        {
          post.status === BlogStatus.COMPLETED && (
            <>
              <span>Created: {formatDate(post.createdAt)}</span>
              <span>Updated: {formatDate(post.updatedAt)}</span>
            </>
          )
        }
      </CardFooter>
    </Card>
  );
}