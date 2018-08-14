import { Injectable } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { App } from './shared/app.model';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  public defaultDescription =
    'Flathub is the home of hundreds of apps and games which can be' +
    ' easily installed on any Linux distribution. Enjoy GIMP, LibreOffice, VLC, Spotify and many more!';
  public defaultTags: Array<MetaDefinition> = [
    // For Google
    {
      name: 'description',
      content: this.defaultDescription,
    },
    {
      name: 'keywords',
      content: 'install, flatpak, applications, games, linux, ubuntu, fedora, GIMP, Spotify, STEAM, VLC, Skype, Slack',
    },
    { name: 'author', content: 'flathub.org' },
    // TODO: choose copyright
    // { name: 'copyright', content: 'Apache' },
    { name: 'application-name', content: 'Flathub' },

    // For Facebook
    { property: 'og:title', content: 'Flathub' },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: 'https://flathub.org/assets/themes/flathub/flathub-logo-toolbar.svg' },
    { property: 'og:url', content: 'https://flathub.org' + this.location.path() },
    {
      property: 'og:description',
      content: this.defaultDescription,
    },

    // For Tweeter
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Flathub' },
    {
      name: 'twitter:description',
      content: this.defaultDescription,
    },
    { name: 'twitter:image', content: 'https://flathub.org/assets/themes/flathub/flathub-logo-toolbar.svg' },
  ];
  lastRoute: String = undefined;

  constructor(private meta: Meta, private router: Router, private location: Location) {
    router.events.subscribe((val) => {
      if (this.lastRoute !== this.location.path()) {
        this.lastRoute = this.location.path();
        this.updateTag(
          { property: 'og:url', content: 'https://flathub.org' + this.location.path() },
          'property="og:url"',
        );
      }
    });
  }

  public addTags(tags: MetaDefinition[], forceCreation?: boolean) {
    return this.meta.addTags(tags, forceCreation);
  }


  public addDefaultTags() {
    return this.addTags(this.defaultTags);
  }

  public updateTag(tag: MetaDefinition, selector?: string) {
    if (this.meta.getTag(selector)) {
      this.meta.updateTag(tag, selector);
    } else {
      this.meta.addTag(tag);
    }
  }

  public addAppTags(app?: App) {
    if (app) {
      this.updateTag({ name: 'description', content: this.stripHTMLTags(app.description) }, 'name="description"');
      this.updateTag(
        { name: 'keywords', content: 'install,flatpak,' + app.name + ',linux,ubuntu,fedora' },
        'name="keywords"',
      );
      this.updateTag({ property: 'og:title', content: app.name + ' on Flathub' }, 'property="og:title"');
      this.updateTag(
        { property: 'og:image', content: 'https://flathub.org' + app.iconDesktopUrl },
        'property="og:image"',
      );
      this.updateTag(
        { property: 'og:description', content: this.stripHTMLTags(app.description) },
        'property="og:description"',
      );
      this.updateTag({ name: 'twitter:title', content: app.name + ' on Flathub' }, 'name="twitter:title"');
      this.updateTag(
        { name: 'twitter:image', content: 'https://flathub.org' + app.iconDesktopUrl },
        'name="twitter:image"',
      );
      this.updateTag(
        { name: 'twitter:description', content: this.stripHTMLTags(app.description) },
        'name="twitter:description"',
      );
    } else {
      this.updateTag({ name: 'description', content: 'App not found' }, 'name="description"');
    }
  }

  removeAppTags() {
    this.updateTag({ name: 'description', content: this.defaultDescription }, 'name="description"');
    this.updateTag(
      {
        name: 'keywords',
        content:
          'install, flatpak, applications, games, linux, ubuntu, fedora, GIMP, Spotify, STEAM, VLC, Skype, Slack',
      },
      'name="keywords"',
    );
    this.updateTag({ property: 'og:title', content: 'Flathub' }, 'property="og:title"');
    this.updateTag(
      { property: 'og:image', content: 'https://flathub.org/assets/themes/flathub/flathub-logo-toolbar.svg' },
      'property="og:image"',
    );
    this.updateTag({ property: 'og:description', content: this.defaultDescription }, 'property="og:description"');
    this.updateTag({ name: 'twitter:title', content: 'Flathub' }, 'name="twitter:title"');
    this.updateTag(
      { name: 'twitter:image', content: 'https://flathub.org/assets/themes/flathub/flathub-logo-toolbar.svg' },
      'name="twitter:image"',
    );
    this.updateTag({ name: 'twitter:description', content: this.defaultDescription }, 'name="twitter:description"');
  }

  public stripHTMLTags(input: String) {
    return input.replace(/<\/?[^>]+(>|$)/g, '');
  }
}
