import { RemoveAccentsPipe } from './remove-accents.pipe';

describe('RemoveAccentsPipe', () => {
  it('create an instance', () => {
    const pipe = new RemoveAccentsPipe();
    expect(pipe).toBeTruthy();
  });
});
