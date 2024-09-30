import { FaRocket } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const PricingCard: React.FC<{
  title: string;
  price: string;
  features: string[];
}> = ({ title, price, features }) => (
  <div className='animate-fade-in-up'>
    <Card className='bg-purple-800 text-white h-[350px ]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className='text-3xl font-bold text-yellow-300'>
          {price}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-center space-x-2'>
              <FaRocket className='text-yellow-300' />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className='w-full bg-transparent outline outline-1 outline-yellow-300  hover:text-purple-900 hover:bg-yellow-300 '>
          Choose Plan
        </Button>
      </CardFooter>
    </Card>
  </div>
);
export default PricingCard;