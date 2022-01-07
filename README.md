# VolanteS3

Volante module for working with S3 Buckets and Objects

## Usage

Due to the way S3 works, VolanteS3 is ready to go immediately after configuration - there is no connection to a server which needs to "succeed" before you can begin making requests.

Easiest way to configure is to include a block for `VolanteS3` in your `config.json`:

```js
{
...
  "VolanteS3": {
    "endpoint": "http://mys3server",
    "accessKey": "W4UXK7TERH1QNBFVQ00I",
    "secretKey": "ydwP5Hcj0650GZNFjjb192rmdu5bh7IjARA0rCbc"
  }
...
}
```

> See `src/index.js` for the full props and descriptions

VolanteS3 can then be used by calling its methods directly. All methods return a Promise and can be used with `await`.

### Buckets

- `listBuckets()` - returns the available buckets
- `createBucket(bucket)` - create a bucket with the given name
  - bucket - _string_ - the bucket name
- `deleteBucket(bucket)`
  - bucket - _string_ - the bucket name

### Objects

- `putObject(bucket, key, body)` - insert an object into an S3 bucket
  - bucket - _string_ - the bucket name
  - key - _string_ - the object key name
  - body - _string/Buffer/ReadableStream_ - the object data
- `listObjects(bucket, prefix, maxKeys)` - returns metadata for objects in an S3 bucket
  - bucket - _string_ - the bucket name
  - prefix - _string_ - object key prefix to filter listing
  - maxKeys - _number_ - __default: 1000__ - number of object metadata items to return
- `getObject(bucket, key, asStream)` - returns string content of an object
  - bucket - _string_ - the bucket name
  - key - _string_ - the object key name
  - asStream - _boolean_ - __default: false__ - returns a ReadableStream instead of a string
- `deleteObject(bucket, key)` - delete an object by key name
  - bucket - _string_ - the bucket name
  - key - _string_ - the object key name