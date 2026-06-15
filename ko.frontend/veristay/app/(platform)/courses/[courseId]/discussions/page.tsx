'use client';

import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, Reply } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/app/store/store';

// Mock discussion data
const mockDiscussions = [
    {
        id: '1',
        title: 'Question about Module 1 content',
        content: 'I have a question about the security protocols discussed in Module 1...',
        author: {
            name: 'John Doe',
            avatar: '/avatars/john.png',
        },
        timestamp: '2024-03-15T10:30:00Z',
        replies: 3,
        likes: 5,
        moduleId: 'module-1',
    },
    {
        id: '2',
        title: 'Clarification needed for practical exercise',
        content: 'Can someone explain the practical exercise in Module 2?',
        author: {
            name: 'Jane Smith',
            avatar: '/avatars/jane.png',
        },
        timestamp: '2024-03-14T15:45:00Z',
        replies: 2,
        likes: 2,
        moduleId: 'module-2',
    },
];

export default async function CourseDiscussionsPage({
    params,
}: {
    params: Promise<{ courseId: number }>;
}) {
    const { courseId } = await params;
    const courses = useAppSelector((state) => state.coursesStore.courses);
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Course Discussions</h1>
                <Link href={`/courses/${course.id}`}>
                    <Button variant="outline">Back to Course</Button>
                </Link>
            </div>

            <Card className="p-6">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Start a Discussion</h2>
                    <Textarea
                        placeholder="What would you like to discuss?"
                        className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                        <Button>Post Discussion</Button>
                    </div>
                </div>
            </Card>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Recent Discussions</h2>
                <div className="space-y-4">
                    {mockDiscussions.map((discussion) => (
                        <Card key={discussion.id} className="p-4">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <Avatar>
                                            <AvatarImage src={discussion.author.avatar} />
                                            <AvatarFallback>
                                                {discussion.author.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium">{discussion.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Posted by {discussion.author.name} •{' '}
                                                {new Date(
                                                    discussion.timestamp
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        {discussion.replies} Replies
                                    </Button>
                                </div>
                                <p className="text-sm">{discussion.content}</p>
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="sm">
                                        <ThumbsUp className="h-4 w-4 mr-2" />
                                        {discussion.likes}
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Reply className="h-4 w-4 mr-2" />
                                        Reply
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
