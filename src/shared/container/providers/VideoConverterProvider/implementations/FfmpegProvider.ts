import ffmpeg from 'fluent-ffmpeg';
import IVideoConverterProvider from '../models/IVideoConverterProvider';

class FfmpegProvider implements IVideoConverterProvider {
  constructor() {}

  async create({
    image_sequence,
    music,
    output,
    is_preview,
    watermark
  }): Promise<any> {
    /*
    SETS THE FILTER PARAMETER FOR PREVIEWS OR DELIVERY
    */
    const filter = [
      '[1][0]scale2ref=h=ow/mdar:w=iw/3[#A watermark][video];[#A watermark]format=argb,colorchannelmixer=aa=1[#B watermark overlay];[video][#B watermark overlay]overlay=(main_w-w)'
    ];
    const no_filter = [
      '[1][0]scale2ref=h=ow/mdar:w=iw/3[#A watermark][video];[#A watermark]format=argb,colorchannelmixer=aa=0[#B watermark overlay];[video][#B watermark overlay]overlay=(main_w-w)'
    ];
    /*
    COMPLEX FILTER TERNARY ( filter: with watermark, no_filter: no watermark )
    */
    const complex_filter = is_preview ? filter : no_filter;

    /*
    CONVERT IMAGE SEQUENCE TO VIDEO
    */
    return new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(image_sequence)
        .input(watermark)
        .videoCodec('libx264')
        .outputOptions('-pix_fmt yuv420p')
        .complexFilter(complex_filter)
        .inputFPS(29.97)
        .outputFPS(29.97)
        .input(music)
        .on('progress', progress => {
          console.log(`[ffmpeg] ${JSON.stringify(progress)}`);
        })
        .on('error', err => {
          console.log('ERROR: An error happened: ' + err.message);
          reject(err);
        })
        .on('end', () => {
          console.log('File has been converted succesfully');
          resolve();
        })
        .save(output);
    });

    // ffmpeg()
    //   .input(image_sequence)
    //   .input(watermarkFile)
    //   .videoCodec('libx264')
    //   .outputOptions('-pix_fmt yuv420p')
    //   // incluindo a marca d'agua:
    //   // .complexFilter(complexFilter)
    //   //incluido o audio:
    //   .input(music)
    //   .inputFPS(29.7)
    //   .outputFPS(29.7)
    //   // setup event handlers
    //   .on('progress', e => {
    //     // console.log(e);
    //   })
    //   .on('end', () => {
    //     clearTimeout(progressId2);
    //     console.log('file has been converted succesfully');
    //     job.progress({
    //       step: 2,
    //       name: 'Encoding Video',
    //       percentage: 100
    //     });
    //     emptyImageSequenceFolder();
    //   })
    //   .on('error', err => {
    //     clearTimeout(progressId2);
    //     console.log('an error happened: ' + err.message);
    //   })
    //   // save to file
    //   .save(videoFile);
  }
}

export default FfmpegProvider;
