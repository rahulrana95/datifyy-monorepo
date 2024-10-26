// server/main.go
package main

import (
    "context"
    "log"
    "net"

    pb "monorepo-datifyy/services/go-service/proto"
    "google.golang.org/grpc"
)

// server is used to implement the Greeter service.
type server struct {
    pb.UnimplementedGreeterServer
}

// SayHello implements the Greeter.SayHello method.
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
    log.Printf("Received: %v", in.GetName())
    return &pb.HelloReply{Message: "Hello " + in.GetName()}, nil
}

func main() {
    // Set up a listener on port 50051
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("Failed to listen: %v", err)
    }

    // Create a new gRPC server
    s := grpc.NewServer()
    pb.RegisterGreeterServer(s, &server{})

    log.Println("gRPC server is running on port 50051")
    if err := s.Serve(lis); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
