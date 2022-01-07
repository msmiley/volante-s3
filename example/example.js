module.exports = {
  name: 'S3Example',
  init() {
    this.test();
  },
  methods: {
    async test() {
      console.log(await this.$spokes.VolanteS3.createBucket('testbucket'));
      console.log(await this.$spokes.VolanteS3.listBuckets());
      console.log(await this.$spokes.VolanteS3.putObject('testbucket', 'testobj1', 'hello'));
      console.log(await this.$spokes.VolanteS3.listObjects('testbucket'));

      try {
        console.log(await this.$spokes.VolanteS3.deleteBucket('testbucket'));
      } catch (e) {
        console.log(e);
        return;
      }

      console.log(await this.$spokes.VolanteS3.listBuckets());
    }
  }
};