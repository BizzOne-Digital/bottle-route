import useReveal from '../../hooks/useReveal';

export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style = {} }) {
  const { ref, visible } = useReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? ' reveal--visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
