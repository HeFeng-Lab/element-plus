# 手把手教你实现一个 Button 组件

实现细节

## 使用场景

别看场景非常简单，实现起来可不简单！

```vue
<template>
  <ElButton type="primary" round @click="handlerClick"></ElButton>
</template>
<script setup>
const handlerClick = () => {}
</script>
```

- 确定 props, emits, 定义 ts 类型
- **bem 规范**，创建基于 bem 规范的 sass 工具函数
- 创建基于 bem 规范的样式：主题色, width, border-width, border-style, border-color, border-radius, size, text-color等等
- 如何在 button 元素应用 bem 规范的样式类

## 确定 props, emits, 定义 ts 类型

定义 props

```ts
import { ExtractPropTypes, PropType } from 'vue'

export type Size = 'small' | 'default' | 'large'
export type Type =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'text'

export const buttonProps = {
  size: String as PropType<Size>,
  type: {
    type: String as PropType<Type>,
    validator(val: string) {
      return [
        'primary',
        'success',
        'warning',
        'danger',
        'info',
        'text'
      ].includes(val)
    }
  },
  plain: Boolean,
  text: Boolean,
  loading: Boolean,
  disabled: Boolean,
  round: Boolean,
  nativeType: {
    // 按钮原生属性
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  }
} as const
```

定义 emits

```ts
export const buttonEmits = {
  click: (e: MouseEvent) => e instanceof MouseEvent
}

export type ButtonEmits = typeof buttonEmits
```

定义 Interface

```ts
import { ExtractPropTypes, PropType } from 'vue'

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
```

**[ExtractPropTypes 是什么？](https://cn.vuejs.org/api/utility-types.html#extractproptypes)**

从运行时的 `props` 选项对象中提取 `props` 类型。提取到的类型是面向内部的，也就是说组件接收到的是解析后的 `props`。这意味着 `boolean` 类型的 `props` 和带有默认值的 `props` 总是一个定义的值，即使它们不是必需的。

```ts
const propsOptions = {
  foo: String,
  bar: Boolean,
  baz: {
    type: Number,
    required: true
  },
  qux: {
    type: Number,
    default: 1
  }
} as const

type Props = ExtractPropTypes<typeof propsOptions>
// {
//   foo?: string,
//   bar: boolean,
//   baz: number,
//   qux: number
// }
```

**ts: as const ?**

```ts
const props = {
  type: String
} as const
```

```ts
declare const props: {
  readonly type: StringConstructor
}
```

## bem 规范

[知乎 link](https://zhuanlan.zhihu.com/p/122214519)

BEM是Block（块）、Element（元素）、Modifier（修饰符）的简写，是一种组件化的 CSS 命名方法和规范，由俄罗斯 Yandex 团队所提出。使用BEM主要是为了将用户界面划分成独立的块，使开发更为简单和快速，有利于团队协作，方便维护。

**Block**
每个块的块名必须是唯一的，用于明确指出它所描述的是哪个块

**Element**
元素是块的组成部分，是依赖上下文的。元素的名称用于描述它是什么，而不是它的状态。

**Modifier**
修饰符可以与块、元素一起工作。我们经常需要在已经定义好的块或者元素上，做一些小调整来满足特定的小功能。

```scss
.block {
}
.block__element {
}
.block--modifier {
}
.block__element--modifier {
}
```

## bem 全局变量

```scss
// mixins/config.scss
$namespace: 'el' !default;
$common-separator: '-' !default;
$element-separator: '__' !default;
$modifier-separator: '--' !default;
$state-prefix: 'is-' !default;
```

## sass 工具函数 -- bem

```scss
// mixins/mixins.scss

@use 'function' as *;
@use '../common/var' as *;
// forward mixins
@forward 'config';
@forward 'function';
@forward '_var';
@use 'config' as *;

// 仅仅使用一次，私有变量不被引用
@use 'config' as *;

// 将 config 的变量继续导出
@forward 'config';
@mixin b($block) {
  $B: $namespace + $common-separator + $block !global;

  .#{$B} {
    @content;
  }
}

@mixin e($element) {
  $E: $element !global;
  $selector: &;
  $currentSelector: '';
  @each $unit in $element {
    $currentSelector: #{$currentSelector +
      '.' +
      $B +
      $element-separator +
      $unit +
      ','};
  }

  @if hitAllSpecialNestRule($selector) {
    @at-root {
      #{$selector} {
        #{$currentSelector} {
          @content;
        }
      }
    }
  } @else {
    @at-root {
      #{$currentSelector} {
        @content;
      }
    }
  }
}

@mixin m($modifier) {
  $selector: &;
  $currentSelector: '';
  @each $unit in $modifier {
    $currentSelector: #{$currentSelector +
      $selector +
      $modifier-separator +
      $unit +
      ','};
  }

  @at-root {
    #{$currentSelector} {
      @content;
    }
  }
}
```

**示例**

```scss
@include b(button) {
  font-size: 16px;
}

/** compile to css **/

.el-button {
  font-size: 16px;
}
```

```scss
@include b(button) {
  font-size: 16px;

  @include m(primary) {
    color: #409eff;
  }
}

/** compile to css **/

.el-button {
  font-size: 16px;
}
.el-button--primary {
  color: #409eff;
}
```

```scss
@include b(button) {
  font-size: 16px;

  @include e(left right) {
    width: 120px;
  }
}

/** compile to css **/

.el-button {
  font-size: 16px;
}
.el-button .el-button__left,
.el-button .el-button__right {
  width: 120px;
}
```

## sass 工具函数 -- when

```scss
@mixin when($state) {
  @at-root {
    &.#{$state-prefix + $state} {
      @content;
    }
  }
}
```

**示例**

```scss
@include b(button) {
  font-size: 16px;
  @include when(disabled) {
    display: disabled;
  }
}

/** compile to css **/

.el-button {
  font-size: 16px;
}
.el-button.is-disabled {
  display: disabled;
}
```

## function sass utils

为了后续快速定义 :root 上的变量，还需要添加一些工具函数

形如：

```css
:root {
  color-scheme: light;
  --el-color-white: #ffffff;
  --el-color-black: #000000;
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;
}
```

```scss
// function.scss
@use 'config';

// getCssVarName('button', 'text-color') => '--el-button-text-color'
@function getCssVarName($args...) {
  @return joinVarName($args);
}

// join var name
// joinVarName(('button', 'text-color')) => '--el-button-text-color'
@function joinVarName($list) {
  $name: '--' + config.$namespace;
  @each $item in $list {
    @if $item != '' {
      $name: $name + '-' + $item;
    }
  }
  @return $name;
}

// getCssVar('button', 'text-color') => var(--el-button-text-color)
@function getCssVar($args...) {
  @return var(#{joinVarName($args)});
}
```

## \_var sass utils

```scss
@use 'sass:map';

@use 'config';
@use 'function' as *;
@use '../common/var' as *;

// set css var value, because we need translate value to string
// for example:
// @include set-css-var-value(('color', 'primary'), red);
// --el-color-primary: red;
@mixin set-css-var-value($name, $value) {
  #{joinVarName($name)}: #{$value};
}

@mixin set-css-color-type($colors, $type) {
  @include set-css-var-value(('color', $type), map.get($colors, $type, 'base'));

  @each $i in (3, 5, 7, 8, 9) {
    @include set-css-var-value(
      ('color', $type, 'light', $i),
      map.get($colors, $type, 'light-#{$i}')
    );
  }

  @include set-css-var-value(
    ('color', $type, 'dark-2'),
    map.get($colors, $type, 'dark-2')
  );
}

// generate css var from existing css var
// for example:
// @include css-var-from-global(('button', 'text-color'), ('color', $type))
// --el-button-text-color: var(--el-color-#{$type});
@mixin css-var-from-global($var, $gVar) {
  $varName: joinVarName($var);
  $gVarName: joinVarName($gVar);
  #{$varName}: var(#{$gVarName});
}

// set all css var for component by map
@mixin set-component-css-var($name, $variables) {
  @each $attribute, $value in $variables {
    @if $attribute == 'default' {
      #{getCssVarName($name)}: #{$value};
    } @else {
      #{getCssVarName($name, $attribute)}: #{$value};
    }
  }
}
```

## 定义 sass 变量，用于全局访问

```scss
// common/var.scss

/* Element Chalk Variables */
@use 'sass:math';
@use 'sass:map';

@use '../mixins/function' as *;

// types
$types: primary, success, warning, danger, error, info;

// Color
$colors: () !default;
$colors: map.deep-merge(
  (
    'white': #ffffff,
    'black': #000000,
    'primary': (
      'base': #409eff
    ),
    'success': (
      'base': #67c23a
    ),
    'warning': (
      'base': #e6a23c
    ),
    'danger': (
      'base': #f56c6c
    ),
    'error': (
      'base': #f56c6c
    ),
    'info': (
      'base': #909399
    )
  ),
  $colors
);

$color-white: map.get($colors, 'white') !default;
$color-black: map.get($colors, 'black') !default;
$color-primary: map.get($colors, 'primary', 'base') !default;
$color-success: map.get($colors, 'success', 'base') !default;
$color-warning: map.get($colors, 'warning', 'base') !default;
$color-danger: map.get($colors, 'danger', 'base') !default;
$color-error: map.get($colors, 'error', 'base') !default;
$color-info: map.get($colors, 'info', 'base') !default;

// https://sass-lang.com/documentation/values/maps#immutability
// mix colors with white/black to generate light/dark level
@mixin set-color-mix-level(
  $type,
  $number,
  $mode: 'light',
  $mix-color: $color-white
) {
  $colors: map.deep-merge(
    (
      $type: (
        '#{$mode}-#{$number}': mix($mix-color, map.get($colors, $type, 'base'), math.percentage(math.div($number, 10)))
      )
    ),
    $colors
  ) !global;
}

// $colors.primary.light-i
// --el-color-primary-light-i
// 10% 53a8ff
// 20% 66b1ff
// 30% 79bbff
// 40% 8cc5ff
// 50% a0cfff
// 60% b3d8ff
// 70% c6e2ff
// 80% d9ecff
// 90% ecf5ff
@each $type in $types {
  @for $i from 1 through 9 {
    @include set-color-mix-level($type, $i, 'light', $color-white);
  }
}

// --el-color-primary-dark-2
@each $type in $types {
  @include set-color-mix-level($type, 2, 'dark', $color-black);
}

$common-component-size: () !default;
$common-component-size: map.merge(
  (
    'large': 40px,
    'default': 32px,
    'small': 24px
  ),
  $common-component-size
);

$input-font-size: () !default;
$input-font-size: map.merge(
  (
    'large': 14px,
    'default': 14px,
    'small': 12px
  ),
  $input-font-size
);

$input-height: () !default;
$input-height: map.merge($common-component-size, $input-height);

$button-padding-vertical: () !default;
$button-padding-vertical: map.merge(
  (
    'large': 13px,
    'default': 9px,
    'small': 6px
  ),
  $button-padding-vertical
);

$button-padding-horizontal: () !default;
$button-padding-horizontal: map.merge(
  (
    'large': 20px,
    'default': 16px,
    'small': 12px
  ),
  $button-padding-horizontal
);

$button-font-size: () !default;
$button-font-size: map.merge(
  (
    'large': getCssVar('font-size', 'base'),
    'default': getCssVar('font-size', 'base'),
    'small': 12px
  ),
  $button-font-size
);

// Border
$border-width: 1px !default;
$border-style: solid !default;
$border-color-hover: getCssVar('text-color', 'disabled') !default;

$button-border-radius: () !default;
$button-border-radius: map.merge(
  (
    'large': getCssVar('border-radius', 'base'),
    'default': getCssVar('border-radius', 'base'),
    'small': calc(#{getCssVar('border-radius', 'base')} - 1px)
  ),
  $button-border-radius
);

$border-width: 1px !default;

$button-border-width: $border-width !default;

$border-radius: () !default;
$border-radius: map.merge(
  (
    'base': 4px,
    'small': 2px,
    'round': 20px,
    'circle': 100%
  ),
  $border-radius
);

$text-color: () !default;
$text-color: map.merge(
  (
    'primary': #303133,
    'regular': #606266,
    'secondary': #909399,
    'placeholder': #a8abb2,
    'disabled': #c0c4cc
  ),
  $text-color
);

$border-color: () !default;
$border-color: map.merge(
  (
    '': #dcdfe6,
    'light': #e4e7ed,
    'lighter': #ebeef5,
    'extra-light': #f2f6fc,
    'dark': #d4d7de,
    'darker': #cdd0d6
  ),
  $border-color
);

// Button
// css3 var in packages/theme-chalk/src/button.scss
$button: () !default;
$button: map.merge(
  (
    'font-weight': getCssVar('font-weight-primary'),
    'border-color': getCssVar('border-color'),
    'bg-color': getCssVar('fill-color', 'blank'),
    'text-color': getCssVar('text-color', 'regular'),
    'disabled-text-color': getCssVar('disabled-text-color'),
    'disabled-bg-color': getCssVar('fill-color', 'blank'),
    'disabled-border-color': getCssVar('border-color-light'),
    'divide-border-color': rgba($color-white, 0.5),
    'hover-text-color': getCssVar('color-primary'),
    'hover-bg-color': getCssVar('color-primary', 'light-9'),
    'hover-border-color': getCssVar('color-primary-light-7'),
    'active-text-color': getCssVar('button-hover-text-color'),
    'active-border-color': getCssVar('color-primary'),
    'active-bg-color': getCssVar('button', 'hover-bg-color'),
    'outline-color': getCssVar('color-primary', 'light-5'),
    'hover-link-text-color': getCssVar('color-info'),
    'active-color': getCssVar('text-color', 'primary')
  ),
  $button
);
```

## 定义 :root 变量

```scss
// CSS3 var
@use 'common/var' as *;
@use 'mixins/var' as *;
@use 'mixins/mixins' as *;
@use 'mixins/function' as *;

// for light
:root {
  color-scheme: light;

  @include set-css-var-value('color-white', $color-white);
  @include set-css-var-value('color-black', $color-black);

  // // --el-color-#{$type}
  // // --el-color-#{$type}-light-{$i}
  @each $type in (primary, success, warning, danger, error, info) {
    @include set-css-color-type($colors, $type);
  }

  // --el-border-radius-#{$type}
  @include set-component-css-var('border-radius', $border-radius);

  // Border
  @include set-css-var-value('border-width', $border-width);
  @include set-css-var-value('border-style', $border-style);
  @include set-css-var-value('border-color-hover', $border-color-hover);
  @include set-css-var-value(
    'border',
    getCssVar('border-width') getCssVar('border-style') getCssVar('border-color')
  );

  // --el-text-color-#{$type}
  @include set-component-css-var('text-color', $text-color);

  // --el-border-color-#{$type}
  @include set-component-css-var('border-color', $border-color);
}
```

看看 :root 下面添加了哪些变量：

```css
/* Element Chalk Variables */
:root {
  color-scheme: light;
  --el-color-white: #ffffff;
  --el-color-black: #000000;
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;
  --el-color-success: #67c23a;
  --el-color-success-light-3: #95d475;
  --el-color-success-light-5: #b3e19d;
  --el-color-success-light-7: #d1edc4;
  --el-color-success-light-8: #e1f3d8;
  --el-color-success-light-9: #f0f9eb;
  --el-color-success-dark-2: #529b2e;
  --el-color-warning: #e6a23c;
  --el-color-warning-light-3: #eebe77;
  --el-color-warning-light-5: #f3d19e;
  --el-color-warning-light-7: #f8e3c5;
  --el-color-warning-light-8: #faecd8;
  --el-color-warning-light-9: #fdf6ec;
  --el-color-warning-dark-2: #b88230;
  --el-color-danger: #f56c6c;
  --el-color-danger-light-3: #f89898;
  --el-color-danger-light-5: #fab6b6;
  --el-color-danger-light-7: #fcd3d3;
  --el-color-danger-light-8: #fde2e2;
  --el-color-danger-light-9: #fef0f0;
  --el-color-danger-dark-2: #c45656;
  --el-color-error: #f56c6c;
  --el-color-error-light-3: #f89898;
  --el-color-error-light-5: #fab6b6;
  --el-color-error-light-7: #fcd3d3;
  --el-color-error-light-8: #fde2e2;
  --el-color-error-light-9: #fef0f0;
  --el-color-error-dark-2: #c45656;
  --el-color-info: #909399;
  --el-color-info-light-3: #b1b3b8;
  --el-color-info-light-5: #c8c9cc;
  --el-color-info-light-7: #dedfe0;
  --el-color-info-light-8: #e9e9eb;
  --el-color-info-light-9: #f4f4f5;
  --el-color-info-dark-2: #73767a;
  --el-border-radius-base: 4px;
  --el-border-radius-small: 2px;
  --el-border-radius-round: 20px;
  --el-border-radius-circle: 100%;
  --el-border-width: 1px;
  --el-border-style: solid;
  --el-border-color-hover: var(--el-text-color-disabled);
  --el-border: var(--el-border-width) var(--el-border-style) var(--el-border-color);
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #a8abb2;
  --el-text-color-disabled: #c0c4cc;
  --el-border-color: #dcdfe6;
  --el-border-color-light: #e4e7ed;
  --el-border-color-lighter: #ebeef5;
  --el-border-color-extra-light: #f2f6fc;
  --el-border-color-dark: #d4d7de;
  --el-border-color-darker: #cdd0d6;
}
```

## \_button.scss 工具函数

```scss
// mixins/_button.scss

@use '../mixins/var' as *;
@use '../mixins/function' as *;
@use '../common/var' as *;

@mixin button-plain($type) {
  $button-color-types: (
    '': (
      'text-color': (
        'color',
        $type
      ),
      'bg-color': (
        'color',
        $type,
        'light-9'
      ),
      'border-color': (
        'color',
        $type,
        'light-5'
      )
    ),
    'hover': (
      'text-color': (
        'color',
        'white'
      ),
      'bg-color': (
        'color',
        $type
      ),
      'border-color': (
        'color',
        $type
      )
    ),
    'active': (
      'text-color': (
        'color',
        'white'
      )
    )
  );

  @each $type, $typeMap in $button-color-types {
    @each $typeColor, $list in $typeMap {
      @include css-var-from-global(('button', $type, $typeColor), $list);
    }
  }

  &.is-disabled {
    &,
    &:hover,
    &:focus,
    &:active {
      color: getCssVar('color', $type, 'light-5');
      background-color: getCssVar('color', $type, 'light-9');
      border-color: getCssVar('color', $type, 'light-8');
    }
  }
}

@mixin button-variant($type) {
  $button-color-types: (
    '': (
      'text-color': (
        'color',
        'white'
      ),
      'bg-color': (
        'color',
        $type
      ),
      'border-color': (
        'color',
        $type
      ),
      'outline-color': (
        'color',
        $type,
        'light-5'
      ),
      'active-color': (
        'color',
        $type,
        'dark-2'
      )
    ),
    'hover': (
      'text-color': (
        'color',
        'white'
      ),
      'link-text-color': (
        'color',
        $type,
        'light-5'
      ),
      'bg-color': (
        'color',
        $type,
        'light-3'
      ),
      'border-color': (
        'color',
        $type,
        'light-3'
      )
    ),
    'active': (
      'bg-color': (
        'color',
        $type,
        'dark-2'
      ),
      'border-color': (
        'color',
        $type,
        'dark-2'
      )
    ),
    'disabled': (
      'text-color': (
        'color',
        'white'
      ),
      'bg-color': (
        'color',
        $type,
        'light-5'
      ),
      'border-color': (
        'color',
        $type,
        'light-5'
      )
    )
  );

  @each $type, $typeMap in $button-color-types {
    @each $typeColor, $list in $typeMap {
      @include css-var-from-global(('button', $type, $typeColor), $list);
    }
  }

  &.is-plain,
  &.is-text,
  &.is-link {
    @include button-plain($type);
  }
}

@mixin button-size(
  $padding-vertical,
  $padding-horizontal,
  $font-size,
  $border-radius
) {
  padding: $padding-vertical $padding-horizontal;
  font-size: $font-size;
  border-radius: $border-radius;
  &.is-round {
    padding: $padding-vertical $padding-horizontal;
  }
}
```

## button.scss

```scss
// src/button.scss

@use 'sass:map';

@use 'common/var' as *;
@use 'mixins/button' as *;
@use 'mixins/mixins' as *;
@use 'mixins/var' as *;

$button-icon-span-gap: () !default;
$button-icon-span-gap: map.merge(
  (
    'large': 8px,
    'default': 6px,
    'small': 4px
  ),
  $button-icon-span-gap
);

@include b(button) {
  @include set-component-css-var('button', $button);
}

@include b(button) {
  display: inline-flex;
  justify-content: center;
  align-items: center;

  line-height: 1;
  // min-height will expand when in flex
  height: map.get($input-height, 'default');
  white-space: nowrap;
  cursor: pointer;
  color: getCssVar('button', 'text-color');
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: 0.1s;
  font-weight: getCssVar('button', 'font-weight');
  user-select: none;
  vertical-align: middle;
  -webkit-appearance: none;
  background-color: getCssVar('button', 'bg-color');
  border: getCssVar('border');
  border-color: getCssVar('button', 'border-color');

  &:hover,
  &:focus {
    color: getCssVar('button', 'hover', 'text-color');
    border-color: getCssVar('button', 'hover', 'border-color');
    background-color: getCssVar('button', 'hover', 'bg-color');
    outline: none;
  }

  &:active {
    color: getCssVar('button', 'active', 'text-color');
    border-color: getCssVar('button', 'active', 'border-color');
    background-color: getCssVar('button', 'active', 'bg-color');
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid getCssVar('button', 'outline-color');
    outline-offset: 1px;
  }

  > span {
    display: inline-flex;
    align-items: center;
  }

  & + & {
    margin-left: 12px;
  }

  @include button-size(
    map.get($button-padding-vertical, 'default') - $button-border-width,
    map.get($button-padding-horizontal, 'default') - $button-border-width,
    map.get($button-font-size, 'default'),
    map.get($button-border-radius, 'default')
  );

  &::-moz-focus-inner {
    border: 0;
  }

  & [class*='#{$namespace}-icon'] {
    & + span {
      margin-left: map.get($button-icon-span-gap, 'default');
    }
    svg {
      vertical-align: bottom;
    }
  }

  @each $type in (primary, success, warning, danger, info) {
    @include m($type) {
      @include button-variant($type);
    }
  }

  @include when(active) {
    color: getCssVar('button', 'active', 'text-color');
    border-color: getCssVar('button', 'active', 'border-color');
    background-color: getCssVar('button', 'active', 'bg-color');
    outline: none;
  }
}
```

查看 button.scss 编译后的样子

```css
/* Element Chalk Variables */
.el-button {
  --el-button-font-weight: var(--el-font-weight-primary);
  --el-button-border-color: var(--el-border-color);
  --el-button-bg-color: var(--el-fill-color-blank);
  --el-button-text-color: var(--el-text-color-regular);
  --el-button-disabled-text-color: var(--el-disabled-text-color);
  --el-button-disabled-bg-color: var(--el-fill-color-blank);
  --el-button-disabled-border-color: var(--el-border-color-light);
  --el-button-divide-border-color: rgba(255, 255, 255, 0.5);
  --el-button-hover-text-color: var(--el-color-primary);
  --el-button-hover-bg-color: var(--el-color-primary-light-9);
  --el-button-hover-border-color: var(--el-color-primary-light-7);
  --el-button-active-text-color: var(--el-button-hover-text-color);
  --el-button-active-border-color: var(--el-color-primary);
  --el-button-active-bg-color: var(--el-button-hover-bg-color);
  --el-button-outline-color: var(--el-color-primary-light-5);
  --el-button-hover-link-text-color: var(--el-color-info);
  --el-button-active-color: var(--el-text-color-primary);
}

.el-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  color: var(--el-button-text-color);
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: 0.1s;
  font-weight: var(--el-button-font-weight);
  user-select: none;
  vertical-align: middle;
  -webkit-appearance: none;
  background-color: var(--el-button-bg-color);
  border: var(--el-border);
  border-color: var(--el-button-border-color);
  padding: 8px 15px;
  font-size: var(--el-font-size-base);
  border-radius: var(--el-border-radius-base);
}
.el-button:hover,
.el-button:focus {
  color: var(--el-button-hover-text-color);
  border-color: var(--el-button-hover-border-color);
  background-color: var(--el-button-hover-bg-color);
  outline: none;
}
.el-button:active {
  color: var(--el-button-active-text-color);
  border-color: var(--el-button-active-border-color);
  background-color: var(--el-button-active-bg-color);
  outline: none;
}
.el-button:focus-visible {
  outline: 2px solid var(--el-button-outline-color);
  outline-offset: 1px;
}
.el-button > span {
  display: inline-flex;
  align-items: center;
}
.el-button + .el-button {
  margin-left: 12px;
}
.el-button.is-round {
  padding: 8px 15px;
}
.el-button::-moz-focus-inner {
  border: 0;
}
.el-button [class*='el-icon'] + span {
  margin-left: 6px;
}
.el-button [class*='el-icon'] svg {
  vertical-align: bottom;
}
.el-button--primary {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-primary);
  --el-button-border-color: var(--el-color-primary);
  --el-button-outline-color: var(--el-color-primary-light-5);
  --el-button-active-color: var(--el-color-primary-dark-2);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-link-text-color: var(--el-color-primary-light-5);
  --el-button-hover-bg-color: var(--el-color-primary-light-3);
  --el-button-hover-border-color: var(--el-color-primary-light-3);
  --el-button-active-bg-color: var(--el-color-primary-dark-2);
  --el-button-active-border-color: var(--el-color-primary-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-primary-light-5);
  --el-button-disabled-border-color: var(--el-color-primary-light-5);
}
.el-button--primary.is-plain,
.el-button--primary.is-text,
.el-button--primary.is-link {
  --el-button-text-color: var(--el-color-primary);
  --el-button-bg-color: var(--el-color-primary-light-9);
  --el-button-border-color: var(--el-color-primary-light-5);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-primary);
  --el-button-hover-border-color: var(--el-color-primary);
  --el-button-active-text-color: var(--el-color-white);
}
.el-button--primary.is-plain.is-disabled,
.el-button--primary.is-plain.is-disabled:hover,
.el-button--primary.is-plain.is-disabled:focus,
.el-button--primary.is-plain.is-disabled:active,
.el-button--primary.is-text.is-disabled,
.el-button--primary.is-text.is-disabled:hover,
.el-button--primary.is-text.is-disabled:focus,
.el-button--primary.is-text.is-disabled:active,
.el-button--primary.is-link.is-disabled,
.el-button--primary.is-link.is-disabled:hover,
.el-button--primary.is-link.is-disabled:focus,
.el-button--primary.is-link.is-disabled:active {
  color: var(--el-color-primary-light-5);
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-8);
}

.el-button--success {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-success);
  --el-button-border-color: var(--el-color-success);
  --el-button-outline-color: var(--el-color-success-light-5);
  --el-button-active-color: var(--el-color-success-dark-2);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-link-text-color: var(--el-color-success-light-5);
  --el-button-hover-bg-color: var(--el-color-success-light-3);
  --el-button-hover-border-color: var(--el-color-success-light-3);
  --el-button-active-bg-color: var(--el-color-success-dark-2);
  --el-button-active-border-color: var(--el-color-success-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-success-light-5);
  --el-button-disabled-border-color: var(--el-color-success-light-5);
}
.el-button--success.is-plain,
.el-button--success.is-text,
.el-button--success.is-link {
  --el-button-text-color: var(--el-color-success);
  --el-button-bg-color: var(--el-color-success-light-9);
  --el-button-border-color: var(--el-color-success-light-5);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-success);
  --el-button-hover-border-color: var(--el-color-success);
  --el-button-active-text-color: var(--el-color-white);
}
.el-button--success.is-plain.is-disabled,
.el-button--success.is-plain.is-disabled:hover,
.el-button--success.is-plain.is-disabled:focus,
.el-button--success.is-plain.is-disabled:active,
.el-button--success.is-text.is-disabled,
.el-button--success.is-text.is-disabled:hover,
.el-button--success.is-text.is-disabled:focus,
.el-button--success.is-text.is-disabled:active,
.el-button--success.is-link.is-disabled,
.el-button--success.is-link.is-disabled:hover,
.el-button--success.is-link.is-disabled:focus,
.el-button--success.is-link.is-disabled:active {
  color: var(--el-color-success-light-5);
  background-color: var(--el-color-success-light-9);
  border-color: var(--el-color-success-light-8);
}

.el-button--warning {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-warning);
  --el-button-border-color: var(--el-color-warning);
  --el-button-outline-color: var(--el-color-warning-light-5);
  --el-button-active-color: var(--el-color-warning-dark-2);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-link-text-color: var(--el-color-warning-light-5);
  --el-button-hover-bg-color: var(--el-color-warning-light-3);
  --el-button-hover-border-color: var(--el-color-warning-light-3);
  --el-button-active-bg-color: var(--el-color-warning-dark-2);
  --el-button-active-border-color: var(--el-color-warning-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-warning-light-5);
  --el-button-disabled-border-color: var(--el-color-warning-light-5);
}
.el-button--warning.is-plain,
.el-button--warning.is-text,
.el-button--warning.is-link {
  --el-button-text-color: var(--el-color-warning);
  --el-button-bg-color: var(--el-color-warning-light-9);
  --el-button-border-color: var(--el-color-warning-light-5);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-warning);
  --el-button-hover-border-color: var(--el-color-warning);
  --el-button-active-text-color: var(--el-color-white);
}
.el-button--warning.is-plain.is-disabled,
.el-button--warning.is-plain.is-disabled:hover,
.el-button--warning.is-plain.is-disabled:focus,
.el-button--warning.is-plain.is-disabled:active,
.el-button--warning.is-text.is-disabled,
.el-button--warning.is-text.is-disabled:hover,
.el-button--warning.is-text.is-disabled:focus,
.el-button--warning.is-text.is-disabled:active,
.el-button--warning.is-link.is-disabled,
.el-button--warning.is-link.is-disabled:hover,
.el-button--warning.is-link.is-disabled:focus,
.el-button--warning.is-link.is-disabled:active {
  color: var(--el-color-warning-light-5);
  background-color: var(--el-color-warning-light-9);
  border-color: var(--el-color-warning-light-8);
}

.el-button--danger {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-danger);
  --el-button-border-color: var(--el-color-danger);
  --el-button-outline-color: var(--el-color-danger-light-5);
  --el-button-active-color: var(--el-color-danger-dark-2);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-link-text-color: var(--el-color-danger-light-5);
  --el-button-hover-bg-color: var(--el-color-danger-light-3);
  --el-button-hover-border-color: var(--el-color-danger-light-3);
  --el-button-active-bg-color: var(--el-color-danger-dark-2);
  --el-button-active-border-color: var(--el-color-danger-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-danger-light-5);
  --el-button-disabled-border-color: var(--el-color-danger-light-5);
}
.el-button--danger.is-plain,
.el-button--danger.is-text,
.el-button--danger.is-link {
  --el-button-text-color: var(--el-color-danger);
  --el-button-bg-color: var(--el-color-danger-light-9);
  --el-button-border-color: var(--el-color-danger-light-5);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-danger);
  --el-button-hover-border-color: var(--el-color-danger);
  --el-button-active-text-color: var(--el-color-white);
}
.el-button--danger.is-plain.is-disabled,
.el-button--danger.is-plain.is-disabled:hover,
.el-button--danger.is-plain.is-disabled:focus,
.el-button--danger.is-plain.is-disabled:active,
.el-button--danger.is-text.is-disabled,
.el-button--danger.is-text.is-disabled:hover,
.el-button--danger.is-text.is-disabled:focus,
.el-button--danger.is-text.is-disabled:active,
.el-button--danger.is-link.is-disabled,
.el-button--danger.is-link.is-disabled:hover,
.el-button--danger.is-link.is-disabled:focus,
.el-button--danger.is-link.is-disabled:active {
  color: var(--el-color-danger-light-5);
  background-color: var(--el-color-danger-light-9);
  border-color: var(--el-color-danger-light-8);
}

.el-button--info {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-info);
  --el-button-border-color: var(--el-color-info);
  --el-button-outline-color: var(--el-color-info-light-5);
  --el-button-active-color: var(--el-color-info-dark-2);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-link-text-color: var(--el-color-info-light-5);
  --el-button-hover-bg-color: var(--el-color-info-light-3);
  --el-button-hover-border-color: var(--el-color-info-light-3);
  --el-button-active-bg-color: var(--el-color-info-dark-2);
  --el-button-active-border-color: var(--el-color-info-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-info-light-5);
  --el-button-disabled-border-color: var(--el-color-info-light-5);
}
.el-button--info.is-plain,
.el-button--info.is-text,
.el-button--info.is-link {
  --el-button-text-color: var(--el-color-info);
  --el-button-bg-color: var(--el-color-info-light-9);
  --el-button-border-color: var(--el-color-info-light-5);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-info);
  --el-button-hover-border-color: var(--el-color-info);
  --el-button-active-text-color: var(--el-color-white);
}
.el-button--info.is-plain.is-disabled,
.el-button--info.is-plain.is-disabled:hover,
.el-button--info.is-plain.is-disabled:focus,
.el-button--info.is-plain.is-disabled:active,
.el-button--info.is-text.is-disabled,
.el-button--info.is-text.is-disabled:hover,
.el-button--info.is-text.is-disabled:focus,
.el-button--info.is-text.is-disabled:active,
.el-button--info.is-link.is-disabled,
.el-button--info.is-link.is-disabled:hover,
.el-button--info.is-link.is-disabled:focus,
.el-button--info.is-link.is-disabled:active {
  color: var(--el-color-info-light-5);
  background-color: var(--el-color-info-light-9);
  border-color: var(--el-color-info-light-8);
}

.el-button.is-active {
  color: var(--el-button-active-text-color);
  border-color: var(--el-button-active-border-color);
  background-color: var(--el-button-active-bg-color);
  outline: none;
}
```

可以看到 :root 上 css 变量已经生成，接下来，我们需要在 button 组件上使用这些 css 变量

## 如何在 button 元素应用 bem 规范的样式类？

首先给出最后我们的使用方式

```vue
<button
  :class="[
    ns.b(),
    props.type && ns.m(props.type),
    props.size && ns.m(props.size),
    props.plain && ns.is('plain', props.plain),
    props.disabled && ns.is('disabled', props.disabled),
    props.text && ns.is('text', props.text),
    props.loading && ns.is('loading', props.loading),
    props.round && ns.is('round', props.round)
  ]"
>
    <slot></slot>
</button>

<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils/create'

const ns = createNamespace('button')
</script>
```

那接下来我们创建一下 `createNamespace` 函数，并使用 js 的方式以完成 bem 规范样式类在元素的应用

```ts
const _bem = (prefixedName, blockSuffix, element, modifier) => {
  if (blockSuffix) {
    prefixedName += `-${blockSuffix}`
  }
  if (element) {
    prefixedName += `__${element}`
  }
  if (modifier) {
    prefixedName += `--${modifier}`
  }
  return prefixedName
}

function createBEM(prefixedName: string) {
  const b = (blockSuffix = '') => _bem(prefixedName, blockSuffix, '', '')

  const e = (element = '') =>
    element ? _bem(prefixedName, '', element, '') : ''

  const m = (modifier = '') =>
    modifier ? _bem(prefixedName, '', '', modifier) : ''

  const be = (blockSuffix = '', element = '') =>
    blockSuffix && element ? _bem(prefixedName, blockSuffix, element, '') : ''

  const em = (element, modifier) =>
    element && modifier ? _bem(prefixedName, '', element, modifier) : ''

  const bm = (blockSuffix, modifier) =>
    blockSuffix && modifier ? _bem(prefixedName, blockSuffix, '', modifier) : ''

  const bem = (blockSuffix, element, modifier) =>
    blockSuffix && element && modifier
      ? _bem(prefixedName, blockSuffix, element, modifier)
      : ''

  const is = (name, state?) => (state ? `is-${name}` : '')

  return {
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is
  }
}

export function createNamespace(name: string) {
  const prefixedName = `el-${name}`
  return createBEM(prefixedName)
}

// const ns = createNamespace("button")

// console.log(ns.b())
// console.log(ns.b("box"))
// console.log(ns.e("element"))
// console.log(ns.m("modifier"))
// console.log(ns.be("box", "element"))
// console.log(ns.bm("box", "modifier"))
// console.log(ns.em("element", "modifier"))
// console.log(ns.bem("box", "element", "modifier"))

// console.log(ns.is("checked", true))

// $ tsc ./create.ts && node ./create.js
// el-button
// el-button-box
// el-button__element
// el-button--modifier
// el-button-box__element
// el-button-box--modifier
// el-button__element--modifier
// el-button-box__element--modifier
// is-checked
```

最后看一下效果：

<preview path="./Button.vue"></preview>
