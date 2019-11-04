import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent();
  });

  it('should have a title', () => {
    expect(component.title).toEqual('Twitch Compare');
  });
});
