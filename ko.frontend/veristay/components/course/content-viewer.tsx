import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Download, Play } from 'lucide-react';

type ContentViewerProps = {
  module: {
    id: string;
    title: string;
    description: string;
    content: {
      type: 'video' | 'document' | 'quiz';
      url?: string;
      content?: string;
    }[];
    resources: {
      title: string;
      type: string;
      url: string;
    }[];
  };
  onNext?: () => void;
  onPrevious?: () => void;
  progress?: number;
};

export function ContentViewer({ module, onNext, onPrevious, progress = 0 }: ContentViewerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{module.title}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={onNext}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Module Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {module.content.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                {item.type === 'video' && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Button size="lg" className="rounded-full">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Video content will be displayed here
                    </p>
                  </div>
                )}

                {item.type === 'document' && (
                  <div className="prose max-w-none">
                    <p>{item.content}</p>
                  </div>
                )}

                {item.type === 'quiz' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Quiz</h3>
                    <p className="text-sm text-muted-foreground">
                      Quiz content will be displayed here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          {module.resources.map((resource, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.type.toUpperCase()} Resource
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
