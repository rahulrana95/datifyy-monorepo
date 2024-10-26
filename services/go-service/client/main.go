// client/main.go
package main

import (
    "context"
    "log"
    "time"

    pb "monorepo-datifyy/services/go-service/proto"
    "google.golang.org/grpc"
)

func main() {
    // Connect to the server
    conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
    if err != nil {
        log.Fatalf("Did not connect: %v", err)
    }
    defer conn.Close()

    // Create a new Greeter client
    client := pb.NewGreeterClient(conn)

    // Make a request
    ctx, cancel := context.WithTimeout(context.Background(), time.Second)
    defer cancel()
    response, err := client.SayHello(ctx, &pb.HelloRequest{Name: "World"})
    if err != nil {
        log.Fatalf("Could not greet: %v", err)
    }

    log.Printf("Greeting: %s", response.GetMessage())
}
