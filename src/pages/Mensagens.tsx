import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, Search, MoreHorizontal, Phone, Video, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Mensagens = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);

  const conversations = [
    {
      id: 1,
      user: "João Silva",
      avatar: "https://github.com/shadcn.png",
      lastMessage: "Ótimo! Então confirmo para amanhã às 14h.",
      timestamp: "10:30",
      unread: 2,
      item: "Furadeira de Impacto Bosch",
      status: "confirmado"
    },
    {
      id: 2,
      user: "Maria Santos", 
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      lastMessage: "A câmera ainda está disponível para o fim de semana?",
      timestamp: "09:15",
      unread: 0,
      item: "Câmera DSLR Canon EOS",
      status: "pendente"
    },
    {
      id: 3,
      user: "Pedro Costa",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80", 
      lastMessage: "Perfeito! Obrigado pela locação.",
      timestamp: "Ontem",
      unread: 0,
      item: "Prancha de Surf 6'2\"",
      status: "concluido"
    }
  ];

  const activeConversation = conversations.find(c => c.id === selectedConversation);

  const messages = [
    {
      id: 1,
      sender: "João Silva",
      content: "Olá! Gostaria de alugar sua furadeira para amanhã.",
      timestamp: "09:30",
      isOwn: false
    },
    {
      id: 2,
      sender: "Você",
      content: "Oi João! Sim, ela está disponível. Você precisa para qual horário?",
      timestamp: "09:35",
      isOwn: true
    },
    {
      id: 3,
      sender: "João Silva", 
      content: "Seria das 14h às 18h, para uma pequena reforma em casa.",
      timestamp: "09:40",
      isOwn: false
    },
    {
      id: 4,
      sender: "Você",
      content: "Perfeito! O valor é R$ 25 por dia. Você pode buscar aqui em casa?",
      timestamp: "09:45", 
      isOwn: true
    },
    {
      id: 5,
      sender: "João Silva",
      content: "Ótimo! Então confirmo para amanhã às 14h.",
      timestamp: "10:30",
      isOwn: false
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl flex gap-6 h-[calc(100vh-80px)]">
        {/* Left Sidebar: Conversations List */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border rounded-2xl overflow-hidden bg-background shadow-sm flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold mb-4">Mensagens</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversas..." className="pl-9 bg-muted/50 border-none" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-b last:border-0 ${
                  selectedConversation === conversation.id ? 'bg-muted/50' : 'hover:bg-muted/30'
                }`}
              >
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback>{conversation.user[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-sm truncate">{conversation.user}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1.5">{conversation.lastMessage}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] h-5 font-normal px-1.5">
                      {conversation.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{conversation.item}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Area: Chat */}
        {activeConversation ? (
          <div className={`flex-1 border rounded-2xl overflow-hidden bg-background shadow-sm flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-background z-10">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={() => setSelectedConversation(null)}>
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeConversation.avatar} />
                  <AvatarFallback>{activeConversation.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-sm">{activeConversation.user}</h2>
                  <p className="text-xs text-muted-foreground">Tempo de resposta: 1 hora</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {/* Item Summary in Chat */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-background border rounded-xl p-4 shadow-sm max-w-sm w-full text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Solicitação de aluguel</p>
                  <h3 className="font-semibold mb-1">{activeConversation.item}</h3>
                  <p className="text-sm text-muted-foreground mb-3">15 Fev - 20 Fev (5 dias)</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Locação confirmada
                  </Badge>
                </div>
              </div>

              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm ${
                    message.isOwn 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-white border rounded-tl-none'
                  }`}>
                    <p>{message.content}</p>
                    <span className={`text-[10px] mt-1 block opacity-70 ${message.isOwn ? 'text-right' : 'text-left'}`}>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input 
                  placeholder="Digite uma mensagem..." 
                  className="rounded-full border-muted-foreground/20 focus-visible:ring-offset-0"
                />
                <Button size="icon" className="rounded-full shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center border rounded-2xl bg-muted/10">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">Selecione uma conversa</h3>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Mensagens;
