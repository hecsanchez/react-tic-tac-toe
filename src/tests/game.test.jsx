import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import Home from 'components/pages/Home/Home';

Enzyme.configure({ adapter: new Adapter() });

test('Board has 9 cells', ()=>{
  const wrapper = shallow(<Home />);

  expect(wrapper.find('.cell').length).toEqual(9);
});

test('Cell on click method gets called', () =>{
  const wrapper = shallow(<Home />);
  const mockFn = jest.fn();

  wrapper.instance().handleCellClick = mockFn;
  wrapper.find('.cell').first().simulate('click');

  expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Can move to a position', () =>{
  const wrapper = mount(<Home />);
  wrapper.instance().handleCellClick(0);
  const cell = wrapper.find('.cell').first();

  expect(cell.text()).toEqual('O');
});

test('AI can win the game', () =>{

  const wrapper = mount(<Home />);
  
  wrapper.find('.cell').first().simulate('click');
  wrapper.find('.cell').at(2).simulate('click');
  wrapper.find('.cell').at(3).simulate('click');

  expect(wrapper.state('result')).toBe('You lost🙁');
  expect(wrapper.find('.result').exists()).toEqual(true);
});

test('Player can tie with AI', () =>{

  const wrapper = mount(<Home />);
  
  wrapper.find('.cell').first().simulate('click');
  wrapper.find('.cell').at(1).simulate('click');
  wrapper.find('.cell').at(6).simulate('click');
  wrapper.find('.cell').at(5).simulate('click');
  wrapper.find('.cell').at(8).simulate('click');

  expect(wrapper.state('result')).toBe("It's a tie! 😯");
  expect(wrapper.find('.result').exists()).toEqual(true);
});