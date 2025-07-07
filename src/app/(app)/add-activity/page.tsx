import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Car,
  Utensils,
  Bolt,
  ShoppingCart,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AddActivityPage() {
  return (
    <div className="flex justify-center items-start p-4 md:p-8 pt-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Log New Activity</CardTitle>
          <CardDescription>
            Select a category and log your activity to see its impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="travel" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="travel">
                <Car className="mr-2 h-4 w-4" /> Travel
              </TabsTrigger>
              <TabsTrigger value="food">
                <Utensils className="mr-2 h-4 w-4" /> Food
              </TabsTrigger>
              <TabsTrigger value="energy">
                <Bolt className="mr-2 h-4 w-4" /> Energy
              </TabsTrigger>
              <TabsTrigger value="shopping">
                <ShoppingCart className="mr-2 h-4 w-4" /> Shopping
              </TabsTrigger>
            </TabsList>
            <TabsContent value="travel" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="travel-mode">Mode</Label>
                  <Select>
                    <SelectTrigger id="travel-mode">
                      <SelectValue placeholder="Select mode of transport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car (Gasoline)</SelectItem>
                      <SelectItem value="ev">Car (Electric)</SelectItem>
                      <SelectItem value="plane">Plane</SelectItem>
                      <SelectItem value="metro">Metro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input id="distance" type="number" placeholder="e.g., 25" />
                </div>
                <Button>Calculate & Add</Button>
              </div>
            </TabsContent>
            <TabsContent value="food" className="mt-6">
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select>
                    <SelectTrigger id="meal-type">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="processed">Processed Food</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="e.g., 1 meal" />
                </div>
                <Button>Calculate & Add</Button>
              </div>
            </TabsContent>
             <TabsContent value="energy" className="mt-6">
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appliance">Appliance</Label>
                  <Select>
                    <SelectTrigger id="appliance">
                      <SelectValue placeholder="Select appliance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ac">Air Conditioner</SelectItem>
                      <SelectItem value="heater">Heater</SelectItem>
                      <SelectItem value="lighting">Lighting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours Used</Label>
                  <Input id="hours" type="number" placeholder="e.g., 3" />
                </div>
                <Button>Calculate & Add</Button>
              </div>
            </TabsContent>
            <TabsContent value="shopping" className="mt-6">
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product Type</Label>
                  <Select>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="price">Price / Quantity</Label>
                  <Input id="price" type="number" placeholder="e.g., 50" />
                </div>
                <Button>Calculate & Add</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
