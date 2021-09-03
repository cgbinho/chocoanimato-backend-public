import fs from 'fs-extra';

const EmptyTemporaryImageSequence = async (temp_dir: string): Promise<void> => {
  /*
  EMPTY TEMPORARY IMAGE SEQUENCE FOLDER
  */

  try {
    await fs.remove(temp_dir);
  } catch (err) {
    console.error(err);
  }
};

export default EmptyTemporaryImageSequence;
