import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useMyNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";

/** Caixa de mensagens que a administração envia ao usuário. */
const Notificacoes = () => {
  const { user } = useAuth();
  const { data: notifications = [], isLoading } = useMyNotifications(user?.id);
  const markRead = useMarkNotificationRead();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Notificações</h1>

        {isLoading && <Skeleton className="h-24 w-full rounded-xl" />}

        {!isLoading && notifications.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium text-foreground">Nenhuma notificação</p>
            <p className="text-sm">Avisos da Loquei aparecem aqui.</p>
          </div>
        )}

        <div className="space-y-4">
          {notifications.map((item) => (
            <Card key={item.id} className={item.read_at ? "opacity-70" : "border-primary/40"}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="font-semibold">{item.title}</h2>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(parseISO(item.created_at), "d 'de' MMM, HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-muted-foreground whitespace-pre-line">{item.body}</p>
                {!item.read_at && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => markRead.mutate(item.id)}
                  >
                    Marcar como lida
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Notificacoes;
