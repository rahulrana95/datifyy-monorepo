# services/go-service/Dockerfile
FROM golang:1.19-alpine

WORKDIR /app
COPY . .

RUN go build -o main server/main.go
EXPOSE 50051

CMD ["./main"]
