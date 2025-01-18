import React, { useState, useEffect } from 'react';
    import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './components/ui/dialog';
    import { Input } from './components/ui/input';
    import { Button } from './components/ui/button';
    import { Textarea } from './components/ui/textarea';
    import { Card, CardHeader, CardContent } from './components/ui/card';
    import { CheckCircle, AlertTriangle } from 'lucide-react';
    import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
    import { cn } from './lib/utils';

    function App() {
      const [apiKey, setApiKey] = useState('');
      const [savedApiKey, setSavedApiKey] = useState('');
      const [ideas, setIdeas] = useState([]);
      const [problemIdeas, setProblemIdeas] = useState([]);
      const [loading, setLoading] = useState(false);
      const [validationStatus, setValidationStatus] = useState(null);
      const [prompt, setPrompt] = useState('');
      const [problem, setProblem] = useState('');

      useEffect(() => {
        const storedApiKey = localStorage.getItem('geminiApiKey');
        if (storedApiKey) {
          setSavedApiKey(storedApiKey);
          setApiKey(storedApiKey);
        }
      }, []);

      const validateApiKey = async () => {
        setLoading(true);
        setValidationStatus(null);
        try {
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: 'Hello' }]
              }]
            }),
          });

          if (response.ok) {
            setValidationStatus('valid');
            localStorage.setItem('geminiApiKey', apiKey);
            setSavedApiKey(apiKey);
          } else {
            setValidationStatus('invalid');
          }
        } catch (error) {
          setValidationStatus('invalid');
        } finally {
          setLoading(false);
        }
      };

      const generateIdeas = async () => {
        setLoading(true);
        setIdeas([]);
        try {
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: `Generate 3 unique app ideas based on the following prompt: ${prompt}. Provide a short description for each idea.` }]
              }]
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            const ideaList = text.split('\n\n').filter(Boolean);
            setIdeas(ideaList);
          } else {
            setIdeas(['Failed to generate ideas. Please check your API key and try again.']);
          }
        } catch (error) {
          setIdeas(['An error occurred. Please try again later.']);
        } finally {
          setLoading(false);
        }
      };

      const generateProblemIdeas = async () => {
        setLoading(true);
        setProblemIdeas([]);
        try {
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: `Given the problem: "${problem}", suggest a single app idea that addresses this problem and provide a very brief prompt to create it.` }]
              }]
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            setProblemIdeas([text]);
          } else {
            setProblemIdeas(['Failed to generate ideas. Please check your API key and try again.']);
          }
        } catch (error) {
          setProblemIdeas(['An error occurred. Please try again later.']);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">AI App Idea Generator</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mb-4">
                {savedApiKey ? 'Change API Key' : 'Set API Key'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set Gemini API Key</DialogTitle>
                <DialogDescription>
                  Enter your Gemini API key to use the app.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="apiKey" className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    API Key
                  </label>
                  <Input
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={validateApiKey} disabled={loading}>
                    {loading ? 'Validating...' : 'Validate' }
                  </Button>
                </div>
                {validationStatus === 'valid' && (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    API Key is valid
                  </div>
                )}
                {validationStatus === 'invalid' && (
                  <div className="flex items-center text-red-500">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    API Key is invalid
                  </div>
                )}
              </div>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          <div className="w-full max-w-2xl">
            <Tabs defaultValue="ideas" className="w-full">
              <TabsList>
                <TabsTrigger value="ideas">Generate Ideas</TabsTrigger>
                <TabsTrigger value="problems">Solve Problems</TabsTrigger>
              </TabsList>
              <TabsContent value="ideas">
                <div className="mb-4">
                  <Textarea
                    placeholder="Enter a prompt to generate app ideas"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full mb-2"
                  />
                  <Button onClick={generateIdeas} disabled={loading} className="w-full">
                    {loading ? 'Generating...' : 'Generate Ideas'}
                  </Button>
                </div>

                {ideas.length > 0 && (
                  <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {ideas.map((idea, index) => (
                      <Card key={index} className="mb-4">
                        <CardHeader>
                          <h3 className="text-lg font-semibold">Idea {index + 1}</h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{idea}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="problems">
                <div className="mb-4">
                  <Textarea
                    placeholder="Enter a problem to solve"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full mb-2"
                  />
                  <Button onClick={generateProblemIdeas} disabled={loading} className="w-full">
                    {loading ? 'Generating Solution' : 'Generate Solution'}
                  </Button>
                </div>
                {problemIdeas.length > 0 && (
                  <div className="mt-4">
                    {problemIdeas.map((idea, index) => (
                      <Card key={index} className="mb-4">
                        <CardHeader>
                          <h3 className="text-lg font-semibold">Solution</h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{idea}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );
    }

    export default App;
