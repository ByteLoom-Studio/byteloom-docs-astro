import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";

const accounts = [
    {
        username: "guest",
        password: "20250605",
    }
]

export default function AuthenticationComponent() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    return <div className={cn("flex flex-col gap-6")}>
        <Card>
            <CardHeader>
                <CardTitle>User Login</CardTitle>
                <CardDescription>
                    Please enter your username and password to login.
                </CardDescription>
            </CardHeader>
            <CardContent>

                <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="username"
                                placeholder="Username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input placeholder={"Password"} id="password" type="password" value={password}
                                   onChange={(e) => {
                                       setPassword(e.target.value)
                                   }} required/>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button onClick={() => {
                                const account = accounts.find(acc => acc.username === username && acc.password === password);
                                if (account) {
                                    localStorage.setItem("login", JSON.stringify(account));
                                    window.location.href = "/"; // Redirect to home page after successful login
                                } else {
                                    alert("Invalid username or password");
                                }
                            }} className="w-full">
                                Login
                            </Button>
                        </div>
                    </div>
                
            </CardContent>
        </Card>
    </div>
}