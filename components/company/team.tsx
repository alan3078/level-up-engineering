"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const teamMembers = [
  {
    name: "陳師傅",
    role: "資深裝修師傅",
    experience: "20年經驗",
    description: "專注於高品質裝修工程，對細節要求嚴格。",
    initials: "陳",
  },
  {
    name: "李設計師",
    role: "首席設計師",
    experience: "15年經驗",
    description: "擅長現代簡約及豪華風格設計，曾獲多項設計獎項。",
    initials: "李",
  },
  {
    name: "張工程師",
    role: "水電工程師",
    experience: "18年經驗",
    description: "專業水電工程師，確保所有工程符合安全標準。",
    initials: "張",
  },
];

export function Team() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">專業團隊</h2>
        <p className="text-muted-foreground">
          經驗豐富的專業團隊，為您提供優質服務
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-primary mb-2">
                {member.experience}
              </p>
              <p className="text-sm text-muted-foreground">
                {member.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

