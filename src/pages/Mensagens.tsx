import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Search, MoreHorizontal } from "lucide-react";

const Mensagens = () => {
  const conversations = [
    {
      id: 1,
      user: "João Silva",
      avatar: "/placeholder.svg",
      lastMessage: "Ótimo! Então confirmo para amanhã às 14h.",
      timestamp: "10:30",
      unread: 2,
      item: "Furadeira de Impacto Bosch",
      status: "confirmado"
    },
    {
      id: 2,
      user: "Maria Santos", 
      avatar: "/placeholder.svg",
      lastMessage: "A câmera ainda está disponível para o fim de semana?",
      timestamp: "09:15",
      unread: 0,
      item: "Câmera DSLR Canon EOS",
      status: "pendente"
    },
    {
      id: 3,
      user: "Pedro Costa",
      avatar: "/placeholder.svg", 
      lastMessage: "Perfeito! Obrigado pela locação.",
      timestamp: "Ontem",
      unread: 0,
      item: "Prancha de Surf 6'2\"",
      status: "concluido"
    }
  ];

  const activeConversation = conversations[0];

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Mensagens
          </h1>

          <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
            {/* Lista de Conversas */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Conversas</span>
                  <Badge variant="secondary">{conversations.length}</Badge>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar conversas..." className="pl-9" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className="flex items-center space-x-3 p-4 hover:bg-muted/50 cursor-pointer border-l-4 border-l-brand-blue"
                    >
                      <Avatar>
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.user[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">{conversation.user}</h4>
                          <span className="text-xs text-muted-foreground">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              conversation.status === 'confirmado' ? 'border-brand-green text-brand-green' :
                              conversation.status === 'pendente' ? 'border-accent text-accent' :
                              'border-muted-foreground text-muted-foreground'
                            }`}
                          >
                            {conversation.status}
                          </Badge>
                          {conversation.unread > 0 && (
                            <Badge className="bg-brand-blue text-white text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={activeConversation.avatar} />
                      <AvatarFallback>{activeConversation.user[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{activeConversation.user}</h3>
                      <p className="text-sm text-muted-foreground">
                        {activeConversation.item}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-96">
                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto space-y-4 p-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn 
                          ? 'bg-brand-blue text-white' 
                          : 'bg-muted text-foreground'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwn ? 'text-blue-100' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input de mensagem */}
                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                    />
                    <Button className="bg-gradient-to-r from-brand-blue to-brand-green text-white">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estado vazio */}
          {conversations.length === 0 && (
            <Card className="text-center py-16">
              <CardContent>
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma conversa ainda</h3>
                <p className="text-muted-foreground mb-6">
                  Suas conversas com outros usuários aparecerão aqui
                </p>
                <Button className="bg-gradient-to-r from-brand-blue to-brand-green text-white">
                  Explorar Itens
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Mensagens;