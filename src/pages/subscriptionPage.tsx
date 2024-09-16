import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  name: string
  price: {
    monthly: number
    yearly: number
  }
  description: string
  features: PlanFeature[]
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: {
      monthly: 9.99,
      yearly: 99.99,
    },
    description: "Perfect for individuals and small projects",
    features: [
      { name: "Up to 5 projects", included: true },
      { name: "1GB storage", included: true },
      { name: "Basic analytics", included: true },
      { name: "24/7 support", included: false },
      { name: "Advanced collaboration", included: false },
    ],
  },
  {
    name: "Pro",
    price: {
      monthly: 19.99,
      yearly: 199.99,
    },
    description: "Ideal for growing teams and businesses",
    features: [
      { name: "Unlimited projects", included: true },
      { name: "10GB storage", included: true },
      { name: "Advanced analytics", included: true },
      { name: "24/7 support", included: true },
      { name: "Advanced collaboration", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: {
      monthly: 49.99,
      yearly: 499.99,
    },
    description: "For large-scale operations and teams",
    features: [
      { name: "Unlimited projects", included: true },
      { name: "Unlimited storage", included: true },
      { name: "Custom analytics", included: true },
      { name: "24/7 priority support", included: true },
      { name: "Advanced collaboration", included: true },
    ],
  },
]

export default function SubscriptionPageComponent() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select the perfect plan for your needs
          </p>
          <div className="flex items-center justify-center space-x-4">
            <span
              className={`text-sm ${
                isYearly ? "text-gray-500" : "text-gray-900 font-medium"
              }`}
            >
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-green-500"
            />
            <span
              className={`text-sm ${
                isYearly ? "text-gray-900 font-medium" : "text-gray-500"
              }`}
            >
              Yearly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-gray-800">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  $
                  {isYearly
                    ? plan.price.yearly.toFixed(2)
                    : plan.price.monthly.toFixed(2)}
                  <span className="text-base font-normal text-gray-600">
                    {isYearly ? "/year" : "/month"}
                  </span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mr-2" />
                      )}
                      <span
                        className={
                          feature.included ? "text-gray-700" : "text-gray-500"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-300">
                  Choose {plan.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-12">
          All plans come with a 30-day money-back guarantee. No questions asked.
        </p>
      </motion.div>
    </div>
  );
}