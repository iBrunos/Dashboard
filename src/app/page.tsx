import BarChart from "@/components/BarChart";
import PageTitle from "@/components/PageTitle";
import Card, { CardContent, CardProps } from "@/components/card";
import { Activity, CreditCard, MinusCircle , Users } from "lucide-react";
import SalesCard, { SalesProps } from "@/components/SalesCard";

const cardData: CardProps[] = [
  {
    label: "Email's SPAM",
    amount: "137.674",
    discription: "+20.1% from last month",
    icon: MinusCircle
  },
  {
    label: "Subscription",
    amount: "+2350",
    discription: "+180.1% from last month",
    icon: Users
  },
  {
    label: "Sales",
    amount: "+12,234",
    discription: "+19% from last month",
    icon: CreditCard
  },
  {
    label: "Active Mow",
    amount: "+573",
    discription: "+201 from last month",
    icon: Activity
  }
]

const userSalesData: SalesProps[] = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    salesAmount: "+$1,999.00"
  },
  {
    name: "Jackson Lee",
    email: "isabella.nguyen@email.com",
    salesAmount: "+$1,999.00"
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    salesAmount: "+$39.00"
  },
  {
    name: "William Kim",
    email: "will@email.com",
    salesAmount: "+$299.00"
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    salesAmount: "+$39.00"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Dashboard FortiMail"/>
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((data, index) => (
          <Card 
            key={index}
            amount={data.amount}
            discription={data.discription}
            icon={data.icon}
            label={data.label}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>
          <BarChart/>
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recent Sales</p>
            <p className="text-sm text-gray-400">
              You made 265 sales this month.
            </p>
          </section>
          {userSalesData.map((data, index) => (
            <SalesCard
              key={index}
              email={data.email}
              name={data.name}
              salesAmount={data.salesAmount}
            />
          ))}
        </CardContent>
      </section>
    </div>
  )
}
