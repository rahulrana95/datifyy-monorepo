# Protocol Buffers Definition

This directory contains all protobuf definitions for the Datifyy platform.

## Structure

- `common/` - Common types used across services
- `admin/` - Admin-specific types and services
- `user/` - User-related types
- `dating/` - Dating platform specific types

## Generating Types

To generate TypeScript types for the backend:

```bash
yarn generate-proto-types
```

This will generate types in `services/nodejs-service/src/proto-types/`

## Dependencies

Make sure you have protobuf compiler installed:
```bash
# macOS
brew install protobuf

# Ubuntu/Debian
sudo apt-get install protobuf-compiler
```