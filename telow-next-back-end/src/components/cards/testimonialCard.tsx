import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const TestimonialCard: React.FC<{
  name: string;
  role: string;
  content: string;
}> = ({ name, role, content }) => (
  <div className='animate-fade-in-up'>
    <Card className='bg-white text-purple-900'>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className='italic'>&ldquo;{content}&ldquo;</p>
      </CardContent>
    </Card>
  </div>
);

export default TestimonialCard;