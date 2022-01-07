const s3 = require("@aws-sdk/client-s3");

//
// S3 Volante Module uses client-s3 to facilitate S3 operations in a Volante wheel
// See README.md for usage
//
module.exports = {
  name: 'VolanteS3',
  props: {
    accessKey: null,      // S3 accessKey (sometimes called accessKeyId)
    secretKey: null,      // S3 secretKey
    endpoint: null,       // non-Amazon endoint
    forcePathStyle: true, // use path-style instead of sub-domains
    region: 'us-east-1',  // Amazon region, leave default for local S3
  },
  stats: {
    numCreateBucket: 0,
    numDeleteBucket: 0,
    numPutObject: 0,
    numGetObject: 0,
  },
  data() {
    return {
      client: null, // the S3 client object
    };
  },
  async updated() {
    this.$log('creating S3Client');
    this.client = new s3.S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: this.forcePathStyle,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      }
    });
  },
  methods: {
    //
    // local error handler, logs into volante and re-throws
    //
    handleS3Error(e) {
      throw this.$error(e);
    },
    //////////// BUCKETS ////////////
    //
    // returns an array of buckets
    //
    listBuckets() {
      let cmd = new s3.ListBucketsCommand({});
      return this.client.send(cmd).then((res) => {
        return res.Buckets;
      }).catch(this.handleS3Error);
    },
    //
    // create a bucket
    //
    createBucket(Bucket) {
      let cmd = new s3.CreateBucketCommand({
        Bucket,
      });
      return this.client.send(cmd).then((res) => {
        return res;
      }).catch(this.handleS3Error);
    },
    //
    // delete a bucket
    //
    deleteBucket(Bucket) {
      let cmd = new s3.DeleteBucketCommand({
        Bucket,
      });
      return this.client.send(cmd).then((res) => {
        this.numDeleteBucket++;
        return res;
      }).catch(this.handleS3Error);
    },
    //////////// OBJECTS ////////////
    //
    // put an object into S3
    // Body may be a string, Buffer, or ReadableStream
    //
    putObject(Bucket, Key, Body) {
      let cmd = new s3.PutObjectCommand({
        Bucket,
        Key,
        Body,
      });
      return this.client.send(cmd).then((res) => {
        this.numPutObject++;
        return res;
      }).catch(this.handleS3Error);
    },
    //
    // list objects for specified bucket
    //
    listObjects(Bucket, Prefix='', MaxKeys=1000) {
      this.$debug('getting objects for bucket', Bucket);
      let cmd = new s3.ListObjectsCommand({
        Bucket,
        Prefix,
        MaxKeys,
      });
      return this.client.send(cmd).then((res) => {
        return res.Contents || [];
      }).catch(this.handleS3Error);
    },
    //
    // get a single object by bucket and key, set stream=true to
    // get a ReadableStream which can be piped to e.g. an express response
    //
    getObject(Bucket, Key, asStream=false) {
      let cmd = new s3.GetObjectCommand({ Bucket, Key });
      return this.client.send(cmd).then((res) => {
        this.numGetObject++;
        if (asStream) {
          // return the stream for further piping
          return res.Body;
        } else {
          // collect the stream up and return as string
          return new Promise((resolve, reject) => {
            let chunks = [];
            res.Body.on('data', (chunk) => chunks.push(chunk));
            res.Body.on('error', reject);
            res.Body.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
          });
        }
      }).catch(this.handleS3Error);
    },
    //
    // delete an object by bucket and key
    //
    deleteObject(Bucket, Key) {
      let cmd = new s3.DeleteObjectCommand({ Bucket, Key });
      return this.client.send(cmd).then((res) => {
        return res;
      }).catch(this.handleS3Error);
    },
  },
};

