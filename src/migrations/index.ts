import * as migration_20260630_030843_baseline from './20260630_030843_baseline';
import * as migration_20260707_064413 from './20260707_064413';
import * as migration_20260711_061855_hover_image from './20260711_061855_hover_image';
import * as migration_20260714_072826_hero_messages from './20260714_072826_hero_messages';
import * as migration_20260714_072852_drop_hero_typewriter_words from './20260714_072852_drop_hero_typewriter_words';
import * as migration_20260714_074822_awards_item_name from './20260714_074822_awards_item_name';
import * as migration_20260715_032623_works_gallery_awards from './20260715_032623_works_gallery_awards';
import * as migration_20260715_062415_works_video_block from './20260715_062415_works_video_block';
import * as migration_20260721_050000_works_text_body_rich from './20260721_050000_works_text_body_rich';
import * as migration_20260721_082720_works_text_body_right from './20260721_082720_works_text_body_right';
import * as migration_20260728_033158_footer_show_socials from './20260728_033158_footer_show_socials';

export const migrations = [
  {
    up: migration_20260630_030843_baseline.up,
    down: migration_20260630_030843_baseline.down,
    name: '20260630_030843_baseline',
  },
  {
    up: migration_20260707_064413.up,
    down: migration_20260707_064413.down,
    name: '20260707_064413',
  },
  {
    up: migration_20260711_061855_hover_image.up,
    down: migration_20260711_061855_hover_image.down,
    name: '20260711_061855_hover_image',
  },
  {
    up: migration_20260714_072826_hero_messages.up,
    down: migration_20260714_072826_hero_messages.down,
    name: '20260714_072826_hero_messages',
  },
  {
    up: migration_20260714_072852_drop_hero_typewriter_words.up,
    down: migration_20260714_072852_drop_hero_typewriter_words.down,
    name: '20260714_072852_drop_hero_typewriter_words',
  },
  {
    up: migration_20260714_074822_awards_item_name.up,
    down: migration_20260714_074822_awards_item_name.down,
    name: '20260714_074822_awards_item_name',
  },
  {
    up: migration_20260715_032623_works_gallery_awards.up,
    down: migration_20260715_032623_works_gallery_awards.down,
    name: '20260715_032623_works_gallery_awards',
  },
  {
    up: migration_20260715_062415_works_video_block.up,
    down: migration_20260715_062415_works_video_block.down,
    name: '20260715_062415_works_video_block',
  },
  {
    up: migration_20260721_050000_works_text_body_rich.up,
    down: migration_20260721_050000_works_text_body_rich.down,
    name: '20260721_050000_works_text_body_rich',
  },
  {
    up: migration_20260721_082720_works_text_body_right.up,
    down: migration_20260721_082720_works_text_body_right.down,
    name: '20260721_082720_works_text_body_right',
  },
  {
    up: migration_20260728_033158_footer_show_socials.up,
    down: migration_20260728_033158_footer_show_socials.down,
    name: '20260728_033158_footer_show_socials'
  },
];
