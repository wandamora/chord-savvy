'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { aiChordProgressionTool } from '@/ai/flows/ai-chord-progression-tool';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
  mood: z.string().optional(),
  genre: z.string().optional(),
  key: z.string().optional(),
});

export function AIChordProgressionTool() {
  const [progression, setProgression] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      genre: '',
      key: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setProgression(null);
    try {
      const result = await aiChordProgressionTool(values);
      setProgression(result.chordProgression);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate chord progression. Please try again.",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generator</CardTitle>
        <CardDescription>Describe the progression you want to create. At least one field is recommended.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Happy, Melancholic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pop, Jazz, Rock" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., C Major, A Minor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Progression
            </Button>
          </form>
        </Form>

        {isLoading && (
            <div className="mt-8 text-center flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Generating your progression...</p>
            </div>
        )}

        {progression && (
          <div className="mt-8">
            <h3 className="font-headline text-xl font-semibold mb-4">Generated Progression:</h3>
            <div className="flex flex-wrap gap-4 rounded-lg border bg-background/50 p-6">
              {progression.map((chord, index) => (
                <Badge key={index} className="text-lg px-4 py-2" variant="default">{chord}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
