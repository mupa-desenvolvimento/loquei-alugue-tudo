import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Package } from "lucide-react";
import { Link } from "react-router-dom";

const PainelLocatario = () => {
  const activeRentals = [
    {
      id: 1,
      item: "Furadeira Professional",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=60",
      owner: "Carlos Silva",
      startDate: "15 Jan",
      endDate: "20 Jan",
      totalValue: 125,
      status: "Em andamento",
      daysLeft: 3
    }
  ];

  const upcomingRentals = [
    {
      id: 2,
      item: "Câmera DSLR Canon",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
      owner: "Ana Costa",
      startDate: "25 Fev",
      endDate: "28 Fev",
      totalValue: 240,
      status: "Confirmada",
      daysLeft: 10
    }
  ];

  const pastRentals = [
    {
      id: 3,
      item: "Serra Circular",
      image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&auto=format&fit=crop&q=60",
      owner: "Marcos Oliveira",
      startDate: "10 Dez",
      endDate: "12 Dez",
      totalValue: 80,
      status: "Concluída",
      daysLeft: 0
    }
  ];

  const TripCard = ({ trip }: { trip: any }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer border-muted-foreground/20">
      <div className="aspect-video relative overflow-hidden">
        <img src={trip.image} alt={trip.item} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
          {trip.status}
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg line-clamp-1">{trip.item}</CardTitle>
        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {trip.startDate} - {trip.endDate}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Proprietário: {trip.owner}</span>
          <span className="font-semibold">R$ {trip.totalValue}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/20 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 bg-background hover:bg-muted">Detalhes</Button>
        <Button size="sm" className="flex-1">Mensagem</Button>
      </CardFooter>
    </Card>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-16 border rounded-xl bg-muted/5 dashed border-2 border-dashed">
      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">Nenhuma locação encontrada</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button asChild>
        <Link to="/buscar">Começar a explorar</Link>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Minhas Locações</h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-transparent border-b w-full justify-start h-auto p-0 rounded-none mb-8 overflow-x-auto">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 mr-8 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors">Próximas</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 mr-8 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors">Em andamento</TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 mr-8 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors">Anteriores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             {upcomingRentals.length > 0 ? (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                  {upcomingRentals.map(trip => (
                     <TripCard key={trip.id} trip={trip} />
                  ))}
               </div>
             ) : (
               <EmptyState message="Você não tem nenhuma locação agendada." />
             )}
          </TabsContent>

          <TabsContent value="active" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             {activeRentals.length > 0 ? (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                  {activeRentals.map(trip => (
                     <TripCard key={trip.id} trip={trip} />
                  ))}
               </div>
             ) : (
               <EmptyState message="Você não tem locações em andamento." />
             )}
          </TabsContent>

          <TabsContent value="past" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             {pastRentals.length > 0 ? (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                  {pastRentals.map(trip => (
                     <TripCard key={trip.id} trip={trip} />
                  ))}
               </div>
             ) : (
               <EmptyState message="Você não tem locações anteriores." />
             )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default PainelLocatario;
