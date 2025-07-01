import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCards"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <div>
        <Appbar />
        <div  className="grid grid-cols-8 px-40">
            <div className="col-span-6">
                {blogs.map(blog => <BlogCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"2nd Feb 2024"}
                />)}
            </div>
            <div className="col-span-2 px-4 py-6">
                <h2 className="text-lg font-semibold mb-4">Staff Picks</h2>

                {/* Staff Picks List */}
                <div className="space-y-4">
                    <div>
                    <p className="text-sm text-gray-600">In <span className="font-semibold">Pragmatic Wisdom</span> by Stephan Joppich</p>
                    <h3 className="font-bold text-md mt-1">The Importance of Wasting Time</h3>
                    <p className="text-xs text-gray-500 mt-1">⭐ Apr 5</p>
                    </div>

                    <div>
                    <p className="text-sm text-gray-600">In <span className="font-semibold">Wise & Well</span> by Robert Roy Britt</p>
                    <h3 className="font-bold text-md mt-1">The New and Hopeful Science of Hope</h3>
                    <p className="text-xs text-gray-500 mt-1">⭐ Jun 23</p>
                    </div>

                    <div>
                    <p className="text-sm text-gray-600">In <span className="font-semibold">Dev Genius</span> by Russell Eveleigh</p>
                    <h3 className="font-bold text-md mt-1">My Son Is Now a Proper Generation Alpha Latchkey Kid</h3>
                    <p className="text-xs text-gray-500 mt-1">⭐ Jun 13</p>
                    </div>

                    <p className="text-sm text-blue-600 mt-2 cursor-pointer hover:underline">See the full list</p>
                </div>

                {/* Recommended Topics */}
                <h2 className="text-lg font-semibold mt-6 mb-4">Recommended topics</h2>
                <div className="flex flex-wrap gap-2">
                    {["Self Improvement", "Politics", "Writing", "Relationships", "Cryptocurrency", "Productivity", "Psychology"].map((topic) => (
                    <span key={topic} className="bg-gray-100 px-3 py-1 text-sm rounded-full cursor-pointer hover:bg-gray-200">
                        {topic}
                    </span>
                    ))}
                </div>
            </div>

        </div>
    </div>
}
