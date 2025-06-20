
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, FileText, Vault, Workflow, ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Edit3,
      title: "AI-Powered Drafting",
      description: "Generate professional legal documents with advanced AI assistance tailored to your specific needs."
    },
    {
      icon: FileText,
      title: "Document Summarization",
      description: "Quickly understand complex legal documents with AI-powered summarization and key point extraction."
    },
    {
      icon: Vault,
      title: "Secure Document Vault",
      description: "Store and organize your legal documents with enterprise-grade security and easy access controls."
    },
    {
      icon: Workflow,
      title: "Automated Workflows",
      description: "Streamline your legal processes with customizable workflows and automated document generation."
    }
  ];

  const benefits = [
    "Save 80% of time on document creation",
    "Ensure legal compliance across jurisdictions",
    "Access templates for 100+ document types",
    "Collaborate with team members in real-time"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Edit3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">QlawsAI</span>
            </div>
            <Button 
              onClick={() => navigate('/home')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Launch Workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
            <Zap className="h-4 w-4 mr-2" />
            Powered by Advanced AI
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Legal Documents
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create professional legal documents in minutes, not hours. Our AI-powered platform 
            helps you draft, review, and manage legal documents with confidence and precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/home')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Legal Document Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From drafting to storage, our comprehensive platform covers every aspect of legal document workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Legal Professionals Choose QlawsAI
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join thousands of legal professionals who have transformed their document workflow 
                with our AI-powered platform. Experience the future of legal document creation.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Enterprise Security</h3>
                    <p className="text-gray-600">Bank-level encryption and compliance</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 font-medium">SOC 2 Compliant</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 font-medium">GDPR Ready</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 font-medium">256-bit Encryption</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Legal Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of legal professionals who save hours every week with QlawsAI. 
            Start creating professional documents today.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/home')}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto font-semibold"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">QlawsAI</span>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering legal professionals with AI-powered document creation and management.
          </p>
          <div className="text-sm text-gray-500">
            © 2024 QlawsAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
