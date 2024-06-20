import styles from './Container.module.scss';
import classNames from 'classnames/bind';

let cx = classNames.bind(styles);

export default function Container({ children, className, variant = 'default' }) {
  return (
    <div className={cx({
      component: variant === 'default',
      'wide-component': variant === 'wide',
      'narrow-component': variant === 'narrow',
      'extra-wide-component': variant === 'extra-wide',
      [className]: className
    })}>
      {children}
    </div>
  );
}
